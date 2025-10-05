SHELL=/bin/bash
DOMAIN="quietreference.xyz"

NPM=npm
NPMBIN=./node_modules/.bin
OUTPUTDIR=public

ifeq ($(DEBUG), true)
    PREPEND=
    APPEND=
else
    PREPEND=@
    APPEND=1>/dev/null
endif

build: clean install lint js css minify
    $(PREPEND)$(NPMBIN)/hugo && \
    echo "" && \
    echo "Site built out to ./public dir"

help:
    @echo 'Makefile for quietreference.xyz, a Hugo-built static site.'
    @echo ''
    @echo 'Usage:'
    @echo '   make                                Build the optimized site to ./$(OUTPUTDIR)'
    @echo '   make serve                          Preview the production-ready site at http://localhost:1313'
    @echo '   make lint                           Check your JS and CSS for issues'
    @echo '   make js                             Bundle JavaScript to ./static/js'
    @echo '   make css                            Compile LESS to ./static/css'
    @echo '   make minify                         Optimize JS and images'
    @echo '   make dev                            Start hot-reloading dev server'
    @echo '   make deploy                         Add the site to your local IPFS node'
    @echo '   make publish-to-domain              Update $(DOMAIN) DNS record to latest IPFS hash'
    @echo '   make clean                          Remove generated files'
    @echo ''
    @echo '   DEBUG=true make [command] for verbose output'

serve: install lint js css minify
    $(PREPEND)$(NPMBIN)/hugo server

node_modules:
    $(PREPEND)$(NPM) install $(APPEND)

install: node_modules
    $(PREPEND)[ -d static/js ] || mkdir -p static/js && \
    [ -d static/css ] || mkdir -p static/css

lint: install
    $(PREPEND)$(NPMBIN)/standard && $(NPMBIN)/lessc --lint less/*

js: install
    $(PREPEND)$(NPMBIN)/browserify --noparse=jquery js/{header-and-latest,header}.js \
        -p [ factor-bundle -o static/js/header-and-latest.js -o static/js/header.js ] \
        -o static/js/common.js $(APPEND)

css: install
    $(PREPEND)$(NPMBIN)/lessc --clean-css --autoprefix less/main.less static/css/main.css $(APPEND)

minify: install minify-js minify-img

minify-js: install
    $(PREPEND)find static/js -name '*.js' -exec $(NPMBIN)/uglifyjs {} --compress --output {} $(APPEND) \;

minify-img: install
    $(PREPEND)find static/images -type d -exec $(NPMBIN)/imagemin {}/* --out-dir={} $(APPEND) \; & \
    test -d content/blog/static && find content/blog/static -type d -exec $(NPMBIN)/imagemin {}/* --out-dir={} $(APPEND) \; & \
    wait

dev: install js css
    $(PREPEND)( \
        $(NPMBIN)/nodemon -q --ext less --watch less \
            --exec "$(NPMBIN)/lessc --clean-css --autoprefix less/main.less static/css/main.css" & \
        $(NPMBIN)/watchify --noparse=jquery js/{header-and-latest,header}.js \
            -p [ factor-bundle -o static/js/header-and-latest.js -o static/js/header.js ] \
            -o static/js/common.js & \
        $(NPMBIN)/hugo server -w \
    )

deploy:
    $(PREPEND)rm -rf public/blog ; \
    ipfs add -r -q $(OUTPUTDIR) | tail -n1 > versions/current ; \
    cat versions/current >> versions/history ; \
    export hash=`cat versions/current`; \
    echo ""; \
    echo "Published website:"; \
    echo ""; \
    echo "Next steps:"; \
    echo "- ipfs pin add -r /ipfs/$$hash"; \
    echo "- make publish-to-domain"; \
    rsync -r static/blog public

publish-to-domain: versions/current
    DNSIMPLE_TOKEN="$(shell if [ -f auth.token ]; then cat auth.token; else cat $$HOME/.protocol/dnsimple.ipfs.io.token; fi)" \
    ./dnslink.sh $(DOMAIN) $(shell cat versions/current)

clean:
    $(PREPEND)[ ! -d $(OUTPUTDIR) ] || rm -rf $(OUTPUTDIR) && \
    [ ! -d static/js ] || rm -rf static/js/* && \
    [ ! -d static/css ] || rm -rf static/css/*

.PHONY: build help install lint js css minify minify-js minify-img dev deploy publish-to-domain clean

