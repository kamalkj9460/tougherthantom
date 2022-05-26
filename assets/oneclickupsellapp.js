!function(){
if (window.performance) {
    const navEntries = window.performance.getEntriesByType && window.performance.getEntriesByType('navigation');
    if (navEntries && navEntries.length > 0 && navEntries[0].type === 'back_forward') {
      location.reload();
    } else if (window.performance.navigation && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
      location.reload();
    }
}

!function(){var e=[];window.Promise||e.push("Promise"),window.URLSearchParams||e.push("URL"),Element.prototype.closest||e.push("Element.prototype.closest"),Array.from||e.push("Array.from"),Object.assign||e.push("Object.assign"), Object.entries||e.push("Object.entries"),Object.values||e.push("Object.values"),Array.prototype.includes||e.push("Array.prototype.includes");try{new Event("event")}catch(t){e.push("Event")}try{Symbol}catch(t){e.push("Symbol")}if(e.length){var t=document.createElement("script");t.src="https://cdn.polyfill.io/v3/polyfill.min.js?features="+e.join(",")+"&flags=gated",t.async=!0,document.head.appendChild(t)}Object.setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e}}();

var originalURLSearchParams=URLSearchParams;var ajax,utils={store:Object.freeze(new Store),cookie:{options:{expires:86400,path:"/",encodeValue:!1},get:function(e){var t=document.cookie.match(new RegExp("(?:^|; )"+e.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));return t?decodeURIComponent(t[1]):void 0},set:function(e,t,n){var i=(n=n||this.options).expires;if("number"==typeof i&&i){var r=new Date;r.setTime(r.getTime()+1e3*i),i=n.expires=r}i&&i.toUTCString&&(n.expires=i.toUTCString());var o=e+"="+(t=encodeURIComponent(t));for(var s in n){o+="; "+s;var a=n[s];!0!==a&&(o+="="+a)}document.cookie=o},remove:function(e){this.set(e,null,{expires:-1})}},queryParams:function(e){var t={};return e.replace("?","").split("&").forEach(function(e){var n=e.split("=")[0],i=e.split("=")[1];t[n]=decodeURIComponent(i)}),t},shareableDiscount:function(e){e=e||{};var t=utils.queryParams(location.search)[e.key||"discount"];t&&(utils.cookie.set(e.name||"ocu-share-discount",t,utils.cookie.options),!e.clear||history.pushState(null,null,location.href.replace(/\?.+/,"")))},serializeForm:function(e){return new originalURLSearchParams(new FormData(e).fd || new FormData(e)).toString()},serializeFormEdge:function(e){var t,n=[];if("object"==typeof e&&"FORM"==e.nodeName){var r=e.elements.length;for(i=0;i<r;i++)if((t=e.elements[i]).name&&!t.disabled&&"file"!=t.type&&"reset"!=t.type&&"submit"!=t.type&&"button"!=t.type)if("select-multiple"==t.type)for(j=e.elements[i].options.length-1;j>=0;j--)t.options[j].selected&&(n[n.length]=encodeURIComponent(t.name)+"="+encodeURIComponent(t.options[j].value));else("checkbox"!=t.type&&"radio"!=t.type||t.checked)&&(n[n.length]=encodeURIComponent(t.name)+"="+encodeURIComponent(t.value))}return n.join("&").replace(/%20/g,"+")},serialize:function(e,t,n,i){if(this.helpers.isFormData(t)&&(i=n,n=t,t=null),(t=t||{}).indices=t.indices||!1,n=n||new originalURLSearchParams,this.helpers.isUndefined(e))return n;if(this.helpers.isNull(e))n.append(i,"");else if(this.helpers.isArray(e))if(e.length)e.forEach(function(e,r){var o="object"==typeof e,s=i+"["+(t.indices&&o?r:"")+"]";this.serialize(e,t,n,s)}.bind(this));else{var r=i+"[]";n.append(r,"")}else this.helpers.isDate(e)?n.append(i,e.toISOString()):!this.helpers.isObject(e)||this.helpers.isFile(e)||this.helpers.isBlob(e)?n.append(i,e):Object.keys(e).forEach(function(r){var o=e[r];if(this.helpers.isArray(o))for(;2<r.length&&r.lastIndexOf("[]")===r.length-2;)r=r.substring(0,r.length-2);var s=i?i+"["+r+"]":r;this.serialize(o,t,n,s)}.bind(this));return n},inArray:function(e,t,n){return e.some(function(e){return e[t]===n})},filterObject:function(e,t){return t.reduce(function(t,n){return t[n]=e[n],t},{})},helpers:{isUndefined:function(e){return void 0===e},isNull:function(e){return null===e},isObject:function(e){return e===Object(e)},isArray:function(e){return Array.isArray(e)},isDate:function(e){return e instanceof Date},isBlob:function(e){return e&&"number"==typeof e.size&&"string"==typeof e.type&&"function"==typeof e.slice},isFile:function(e){return this.isBlob(e)&&("object"==typeof e.lastModifiedDate||"number"==typeof e.lastModified)&&"string"==typeof e.name},isFormData:function(e){return e instanceof FormData}}};

function PrecheckoutIntegrations(cartItems) {
    this.cartItems = cartItems;
}

PrecheckoutIntegrations.prototype = {
    get advancedProductOptions() {
        const cartItems = this.cartItems;

        return {
            get present() {
                return !!window.mwProductOptions;
            },
            get relations() {
                return cartItems.reduce(function(acc, item) {
                    if (item.properties && item.properties._mw_option_relation) {
                        acc.push(+item.properties._mw_option_relation.split('_')[0]);
                    }
                    return acc;
                }, []);
            }
        };
    },

    get zapiet() {
        return {
            get present() {
                return !!(window.Zapiet && document.querySelector('#storePickupApp'));
            },
            get params() {
                const params = (Zapiet.Cart && Zapiet.Cart.getUrlParams()) || {};

                return Object.entries(params).reduce(function(acc, keyValue) {
                    if (/^\s*$/.test(keyValue[1])) return acc;
                    const param = {};
                    param[keyValue[0]] = keyValue[1];
                    return (acc.push(param), acc);
                }, []);
            },
            merge: function(params) {
                return (params || []).concat(this.params);
            },
        };
    },

    get simpleInStorePickup() {
        return {
            get present() {
                const checkbox = document.querySelector('#in-store-pick-up');
                return checkbox && checkbox.checked;
            },
            get params() {
                const form = document.querySelector('form[action^="/cart"]');
                if (!form) return [];
                const action = form.action.split(/\?|&/);
                const data = action.slice(7).slice(0, 3);
                const address = action.slice(-6);
                const params = data.concat(address);

                return params.reduce(function(acc, item) {
                    const keyValue = item.split('=');
                    const param = {};
                    param[keyValue[0]] = decodeURIComponent(keyValue[1]);
                    return (acc.push(param), acc);
                }, []);
            },
            merge: function(params) {
                return (params || []).concat(this.params);
            }
        };
    },

    get weglot() {
        return {
            get present() {
                return !!window.Weglot;
            },
            get params() {
                const param = { locale: window.Weglot.getCurrentLang()}

                return [param];
            },
            merge: function(params) {
                return (params || []).concat(this.params);
            }
        }
    },

    get bt() {
        return {
            get present() {
                return !!(window.BT && window.$);
            },
            get addToCartBtn() {
                return document.querySelector('button[name="add"]');
            },
            startLoadingBtn: function() {
                BT.startLoadingBtn($(this.addToCartBtn));
            },
            endLoadingBtn: function() {
                BT.endLoadingBtn($(this.addToCartBtn));
            }
        }
    },

    get exemptify() {
        return {
            get present() {
                const checkoutExemptifyBtn = document.querySelector('[name="checkout-exemptify"]');
                const checkoutButtons = document.querySelectorAll('[data-ocu-checkout]');
                return !!checkoutExemptifyBtn && checkoutButtons.length > 1;
            }
        };
    },

    get tidio() {
        return {
            stateStorageKey: null,
            selector: {
                main: 'script[src*="code.tidio.co"]',
                fallback: 'script[src*="code.tidio"],script[src*="code"][src*="tidio"],script[src*="uploads/redirect"][src*="tidio"]'
            },

            get present() {
                return !!window.tidioChatApi;
            },
            get storageKey() {
                return this.stateStorageKey || (this.stateStorageKey = 'tidio_state_' + (this.publickey || 'preview'));
            },
            get publickey() {
                let scriptTag = document.querySelector(this.selector.main);
                if (!scriptTag) scriptTag = document.querySelector(this.selector.fallback);

                const regex = /([a-z0-9]+)(\.js|$)/g;
                const matches = regex.exec(scriptTag.src);

                if (matches && matches[1].length === 32) return matches[1];
            },
            saveKeyToStorage: function(key, value) {
                const serializedValue = JSON.stringify(value);
                localStorage.setItem(this.storageKey + '_' + key, serializedValue);

            },
            trackEvent: function(event, successCallback) {
                window.tidioChatApi.track('shopify.' + event, {}, successCallback || function() {});
            },
            track: function() {
                try {
                    this.saveKeyToStorage('goToCheckout', true);
                    this.trackEvent('go_to_checkout');
                } catch (e) {
                    console.log('tidio integration error', e.message);
                }
            }
        };
    },

    get buttonLoading() {
        return {
            idTheme: null,
            typeButton: null,
            typeElement: null,
            context: null,
            init(target) {
                this.idTheme = this.supportTheme;

                const button = target.querySelector('[name="add"], [name="checkout"]') || target;
                this.typeButton = button.getAttribute('name');
            },
            get present() {
                return !!(window.hasOwnProperty('Shopify') && window.Shopify !== undefined && Shopify.theme.id === this.idTheme);
            },
            get buttonSelector() {
                return {
                    checkout: 'button[name="checkout"]',
                    add: 'button[name="add"]',
                }[this.typeButton];
            },
            get supportTheme() {
                const arrayThemesWithClasses = [120471879906];
                const arrayThemesWithElements = [120430788673];

                if (arrayThemesWithClasses.indexOf(Shopify.theme.id) !== -1){
                    this.typeElement = 'class';
                    const index = arrayThemesWithClasses.indexOf(Shopify.theme.id);
                    return arrayThemesWithClasses[index];
                }

                if (arrayThemesWithElements.indexOf(Shopify.theme.id) !== -1){
                    this.typeElement = 'element';
                    const index = arrayThemesWithElements.indexOf(Shopify.theme.id);
                    return arrayThemesWithElements[index];
                }
            },
            get buttonElements() {
                return document.querySelectorAll(this.buttonSelector);
            },
            get checkCondition() {
                return this.present && this.buttonElements.length > 0;
            },
            get loaderSelector() {
                return {
                    120471879906: 'btn--loading',
                }[this.idTheme];
            },
            get loaderElement() {
                return {
                    120430788673: '<i class="fa fa-spinner fa-spin"></i>',
                }[this.idTheme];
            },
            startingLoadingAction() {
                const condition = {
                    class: this.addingClasses,
                    element: this.insertElements,
                }[this.typeElement].call(this);
            },
            endingLoadingAction() {
                const condition = {
                    class: this.deletingClasses,
                    element: this.deleteElements,
                }[this.typeElement].call(this);
            },
            addingClasses() {
                this.buttonElements.forEach((element) => {
                    element.setAttribute('disabled', 'disabled');
                    element.classList.add(this.loaderSelector);
                });
            },
            deletingClasses() {
                this.buttonElements.forEach((element) => {
                    element.classList.remove(this.loaderSelector);
                    element.removeAttribute('disabled');
                });
            },
            insertElements() {
                this.buttonElements.forEach((element) => {
                    element.insertAdjacentHTML('beforeend', this.loaderElement);
                });
            },
            deleteElements() {
                this.buttonElements.forEach((element) => {
                    element.removeChild(element.lastChild);
                });
            },
            startLoadingButton() {
                if (this.checkCondition) this.startingLoadingAction();
            },
            endLoadingButton() {
                if (this.checkCondition) this.endingLoadingAction();
            },
        }
    },

    get salesRocket() {
        return {
            get present() {
                return !!window.SalesRocket;
            },
            setup: function() {
                if (!this.present || utils.store.get('salesRocketIntegrationApplied')) return;
                try {
                    document
                        .querySelector('.ws-cs-checkout-btn')
                        .setAttribute('name', 'checkout');
                    utils.store.set('salesRocketIntegrationApplied', true);
                } catch (e) {
                    console.error('salesRocketIntegrationError', e)
                    utils.store.set('salesRocketIntegrationApplied', false);
                }
            }
        }
    },

    get bundlerBuilder() {
        return {
            selector: '/apps/bundles',
            get bundleBuilderInput () {
                return document.querySelector('#bb_proxy_prefix');
            },
            get present() {
                return this.bundleBuilderInput &&
                    this.bundleBuilderInput.value === this.selector &&
                    this.bundlerForm &&
                    !!this.bundlerForm.querySelector(`[formaction="${this.selector}/cart"]`);
            },
            get bundlerForm() {
                return this.bundleBuilderInput.closest(`form[action*="${this.selector}"]`);
            },
            submit() {
                this.bundlerForm.submit();
            }
        }
    },

    get minMaxify() {
        return {
            get present() {
                return !!window.minMaxify;
            },
            get isFunction() {
                return minMaxify.checkLimits instanceof Function;
            },
            get invalid() {
                return this.present && this.isFunction && !minMaxify.checkLimits();
            }
        };
    }
};

if (!window.OCUApi) window.OCUApi = {};
const FALSE_REDIRECT = { redirect_url: null };

window.OCUApi = Object.assign(OCUApi, {
    showUpsell: function(params) {
        const dispatcher = this.context.popupDispatcher;
        const context = this.context;
        dispatcher.context = this.context;
        dispatcher.target = params.form;

        return new Promise((resolve, reject) => {
            const callback = function(res) {
                if (dispatcher._upsellAppInstance()) dispatcher._upsellAppInstance().hide();
                context.integrations.zipifyPages.clear();
                const response = r => ({ skip_cart: lqd.skip_cart, ...r });
                resolve(response(res.detail.response || FALSE_REDIRECT));
            };

            const { blockId, products } = params;

            this.context.integrations.zipifyPages.setProducts(products);
            this.context.integrations.zipifyPages.setBlockId(blockId);

            if (this.context.integrations.zipifyPages.isBlockOutsideProductPage()) {
                return this.context.integrations.zipifyPages.handleZPOutsidePage(this.context, callback);
            }

            if (!dispatcher.isProductAction) {
                context.integrations.zipifyPages.clear();
                return resolve(FALSE_REDIRECT);
            }

            dispatcher.listenCustomEvent(callback);
            dispatcher._show(null, true);
        });
    },

    initialize: function(params) {
        this.context = params.context;
    },

    onAccept: function() {
    },

    onDecline: function() {
    }
});

function PopupDispatcher() {}

PopupDispatcher.prototype = {

    proceed: function(event, target, context) {
        this.context = context;
        this.target = target;
        this.event = event;
        this.appropriateResponse = null;
        this.actualCart = null;
        this.listenCustomEvent();
        this.bt = OCUIncart.integrations().bt;

        this.buttonLoading = this._initButtonLoading();
        this.buttonLoading.init(target);
        this._startLoading();

        const isProductLocation = this.isProductLocationOption(target);
        const isProductOnCart = isProductLocation && lqd.template_name === 'cart';
        OCUIncart._is_product_action = this.isProductAction;

        const isEventPermitted = (!event.isTrusted && this.secondAttempt)
            || isProductOnCart
            || this.context.helpers.isDisabledButton(this.event.target)
            || this.context.helpers.termsOfServiceConfirmation(this.event.target);

        if (isEventPermitted) return this._clearFlow();

        if (this.isProductLocationOption(target)) return this.productLocation(event, target);

        this.context.prevent(event, 'immediate');
        return this.check(event, target);
    },

    check: function(event, target) {
        const self = this.context;
        return self.cart.get()
            .then(self.cart.update)
            .then(function(res) {
                OCUIncart.cart_items = res.data.items || res.data.cart.items;
                lqd.cart = res.data.items ? res.data : res.data.cart;

                try {
                    const app = self.helpers.isSubscriptionProductInCart(lqd.cart);
                    if (app && this.isProductAction) return this.nativeClick();
                    if (app) return self.integrations[app].redirect(event, lqd.cart);
                } catch (e) {
                    return this.checkout();
                }

                if ((utils.store.get('amazonPayInitiated') || lqd.is_precheckout) && !utils.cookie.get('ocu_shown_popup')) {
                    return this.show(event, target);
                }

                this.checkout();
            }.bind(this))
            .catch(this.checkout.bind(this));
    },

    show: function(event, target) {
        this.context.prevent(event);

        if (utils.store.get('amazonPayInitiated')) return null;
        const form = target.closest('[action="/cart"], [action="/checkout"]');
        if (form && !this.context.validate(form)) {
            clearTimeout(utils.store.get('fallback').id);
            utils.store.set('submitted', false);
            return form.reportValidity();
        }

        if (window.disableBodyScroll) disableBodyScroll(); // fix locked scroll at mobile for themes with libs.min.js

        return this._show(event, false);
    },

    _show: function (event, apiMode) {
        this.apiMode = apiMode;

        const self = this.context;
        const isRechargeEnabled = lqd.integrate_with_recharge && !lqd.disabled_by_subscription_app;
        const precheckoutConfig = {
            utils: utils,
            Updater: Updater,
            is_recharge_enabled: isRechargeEnabled,
            is_skip_cart: lqd.skip_cart,
            product: lqd.product,
            integrations: {
                zipifyPages: self.integrations.zipifyPages
            }
        };

        return this[this.appropriateResponse ? '_emptyResolve' : 'getIncartConfig'](this.appropriateResponse)
            .then(function(response) {
                window.OCUIncart.preLoad && window.OCUIncart.preLoad.showLoader();
                self.helpers.beforeCreate();
                utils.store.set('isTargetBuyNow', self.helpers.isBuyNow(event));

                this.kind = response.data.kind;
                precheckoutConfig.config = response.data;
                const isProductPreloaded = lqd.skip_cart || utils.store.get('isTargetBuyNow') || this.apiMode;

                if (precheckoutConfig.product && !isProductPreloaded) {
                    precheckoutConfig.product.quantity = this._quantityOfProduct;
                    precheckoutConfig.product.selectedPageProduct = this._selectedVariant(precheckoutConfig.product.variants);
                }

                self.utils.beforePrecheckoutPopup();
                OCUIncart._is_product_action = this.isProductAction;
                return this._upsellAppInstance().setData(precheckoutConfig);
            }.bind(this))
            .catch(this[apiMode ? '_finalizeEvent' : 'checkout'].bind(this));
    },

    getIncartConfig: function() {
        let query = '/pre_purchase/v1/checkout_offers/appropriate?';
        const endpoint = window.OCUIncart && OCUIncart.appEndpoint;
        const headers = {
            'Content-Type': 'application/json',
            'Shop-Domain': lqd.permanent_domain
        };
        const self = this.context;
        const cart = this.actualCart ? this.actualCart : lqd.cart;
        const isSameCart = self.helpers.isSameCart(cart);
        const isSameCartToken = self.helpers.isSameCartToken(cart);

        if (!isSameCart && !isSameCartToken) utils.cookie.remove('ocu_popup_ids')
        const isShownOfferIdPresent = utils.cookie.get('ocu_popup_ids');

        if (isShownOfferIdPresent) query += 'split_test_weight=' + isShownOfferIdPresent;

        try {
            if (!this.apiMode) this._endLoading();
            const payload = this._incartPayload();
            return axios.post(endpoint + query, payload, { headers: headers });
        } catch (e) {
            this.nativeClick();
            return this._emptyResolve('skip');
        }
    },

    checkout: function(event) {
        const ocuEvent = event && event.type === 'ocuNativeClick';

        if (event && !ocuEvent) {
            if (event.response) console.error(event.response.data.message);
            else console.error(event);
        }

        const originalBehaviorState = this.isProductAction
            && !utils.store.get('isTargetBuyNow')
            && (ocuEvent && event.detail.type !== 'Upgrade')
            && !lqd.skip_cart;

        this._endLoading();
        window.OCUIncart.preLoad && window.OCUIncart.preLoad.hideLoader();

        if (this.bt && this.bt.present) this.bt.endLoadingBtn();

        if (originalBehaviorState) {
            this._upsellAppInstance().hide();
            this.nativeClick();
            return;
        }
        if (event && !(event instanceof Error)) this.context.prevent(event, true);
        const url = event && event.detail && event.detail.response;
        return this.context.checkout({
            redirect: true,
            redirect_url: url && url.redirect_url
        });
    },

    isProductLocationOption: function(target) {
        return lqd.isPopupTriggerPage
            && target.tagName.toLowerCase() === 'form'
            && this._isAddAction(target);
    },

    productLocation: function(event, target) {
        const variantId = this._formVariantId(target);
        if (this.popupAccepted) return this.nativeClick();
        if (!this._variantWasTrigger(variantId) && !this._productWasTrigger()) return this.breakHandling(event, target); // exit handling if product not trigger

        this.context.prevent(event, true);
        if (this.bt && this.bt.present) this.bt.startLoadingBtn();

        target.disabled = true;
        this.verifyToken()
            .then(this[this.secondAttempt ? 'getActualCart' : '_emptyResolve'].bind(this))
            .then((response) => this.actualCart = response && response.data)
            .then(function() {
                this.getIncartConfig({ product_id: lqd.product.id, variant_id: variantId })
                    .then(function(response) {
                        if (response === 'skip') return;
                        if (lqd.skip_cart || this.context.helpers.isBuyNow(this.event)) return this.addAndCheck();
                        this.appropriateResponse = response;
                        this.check(this.event, this.target, null);
                    }.bind(this))
                    .catch(this.nativeClick.bind(this));
            }.bind(this))
    },

    verifyToken: function() {
        // create cart token if no exist, for new session
        return !this.cartToken ? this.context.cart.bulkAdd() : this._emptyResolve();
    },

    addAndCheck: function() {
        this.context.cart.add(this.target)
            .then(function(response) {
                this.check(this.event, this.target, response.data);
            }.bind(this))
            .catch(this.checkout);
    },

    getActualCart: function() {
        return this.context.cart.get();
    },

    nativeClick: function() {
        this._clearFlow();
        this.secondAttempt = true;
        const button = this.target.querySelector('[type="submit"], [name="add"], [name="checkout"]');

        this.context.helpers.removeExtraClassList(button);
        button.click();
        if (this.bt && this.bt.present) this.bt.endLoadingBtn();
    },

    getTriggerAction() {
        const templateTrigger = this.isAcceptableAction(this.targetAction) ? this.targetAction : 'cart';
        return {
            cart: 'cart',
            product: 'product'
        }[templateTrigger];
    },

    isAcceptableAction: function(type) {
        return lqd.isPopupTriggerPage && !!~OCUIncart.popupLocation.indexOf(type);
    },

    breakHandling: function(event, target) {
        if (!lqd.skip_cart) return this._clearFlow()
        this.context.prevent(event);
        return this.context.cart.add(target)
            .then(this.checkout.bind(this))
            .catch(this.checkout.bind(this));
    },

    listenCustomEvent: function(callback) {
        const cb = callback ? callback : this.checkout;
        document.addEventListener('ocuNativeClick', cb.bind(this), { once: true });
    },

    removeCustomEvents: function() {
        document.removeEventListener('ocuNativeClick', this.checkout, true);
    },

    _upsellAppInstance: function() {
        return OCUIncart[this.kind + 'Upsells'];
    },

    _incartPayload() {
        const payload = this.context.helpers.getCartItems(this.actualCart ? this.actualCart.items : lqd.cart.items);
        const variant = this._productPageVariant;
        const shownPopupId = utils.cookie.get('ocu_shown_id');

        payload.cart_token = this.cartToken;
        payload.location = this.getTriggerAction();

        if (shownPopupId) payload.shown_popup_id = shownPopupId;
        if (payload.location === 'product') {

            if (!variant) throw new Error('Variant not found');

            payload.line_items.push(variant)
        }

        utils.store.set('productLocation', variant);

        return payload;
    },

    _isAddAction: function(el) {
        return el && ((/cart\/add/.test(el.action)) || el.dataset.hasOwnProperty('zpAddToCartForm'));
    },

    _variantWasTrigger: function(id) {
        const funnels = OCUIncart.funnels;
        if (funnels.triggers.all) return true;
        return !!~funnels.triggers.variants.indexOf(id);
    },

    _productWasTrigger: function() {
        const triggers = OCUIncart.funnels.triggers;
        if (triggers.all) return true;
        return !!~triggers.products.indexOf(lqd.product.id);
    },

    _formVariantIds: function(target) {
        let form = this.context.cart.serialize(target);
        form = decodeURI(form);

        const matches = form.match(/id(\[\])?=(\d+)/g);
        if (!matches) return [];

        return matches.map(function(item) {
            const result = item.match(/(\d+)/);
            return result && +result[1];
        });
    },

    _formVariantId: function(target) {
        const ids = this._formVariantIds(target);

        if (ids.length === 1) return ids[0];

        return ids.find(function(id) {
            return !!~OCUIncart.funnels.triggers.variants.indexOf(id);
        });
    },

    _emptyResolve: function(response) {
        return new Promise(function(resolve) { resolve(response); });
    },

    _finalizeEvent: function(response) {
        document.dispatchEvent(new CustomEvent('ocuNativeClick', { detail: { redirect_url: null } }));
    },

    _clearFlow() {
        window.OCUIncart.preLoad && window.OCUIncart.preLoad.hideLoader();
        this.context.helpers.clearFallback();
        utils.store.set('submitted', false);
        return null;
    },
    _initButtonLoading: function() {
        return OCUIncart.integrations().buttonLoading;
    },

    _startLoading: function() {
        this.buttonLoading.startLoadingButton();
    },

    _endLoading: function() {
        this.buttonLoading.endLoadingButton();
    },


    _selectedVariant: function(variants) {
        const variantOfProduct = this._productPageVariant.variant_id;
        let price = 0;
        let variantId = null;
        variants.forEach(function (variant) {
            if (variant.id === Number(variantOfProduct)) {
                price = variant.price;
                variantId = variant.id;
            }
        });

        return { price, variantId };
    },

    get _productPageVariant() {
        if (!this.isProductAction) return {};

        const variant = this.target.querySelector('[name="id"], [name="id[]"]');
        const quantity = this.target.querySelector('[name="quantity"]');
        const currentVariant = lqd.product.variants.find(function(item) {
            return item.id === +variant.value && item.available;
        });
        const isVariantAvailable = lqd.product.available || currentVariant;

        const availableVariantId = isVariantAvailable && !Number.isNaN(+variant.value);

        if (!availableVariantId) return null;

        const productEntity = currentVariant || lqd.product;

        return {
            variant_id: +variant.value,
            product_id: lqd.product.id,
            price: productEntity.price,
            quantity: (quantity && +quantity.value) || 1,
            is_product_location: true
        };
    },

    get cartToken() {
        return lqd.cart.token || utils.cookie.get('cart');
    },

    get isProductAction() {
        return this.getTriggerAction() === 'product';
    },

    get destination() {
        if(utils.store.get('isTargetBuyNow')) return 'checkout';
        return this.isProductAction ? 'cart' : 'checkout';
    },

    get popupAccepted() {
        return OCUIncart.settings.popup_frequency === 'accept_or_decline'
            && utils.cookie.get('cart') === utils.cookie.get('ocu_popup_token')
            && !!utils.cookie.get('ocu_accepted');
    },

    get targetAction() {
        if (!this.target) return 'cart';
        const form = this.target && this.target.tagName.toLowerCase() === 'form' ? this.target : this.target.closest('form');
        return this._isAddAction(form) ? 'product' : 'cart';
    },

    get _quantityOfProduct() {
        const quantityInput = document.querySelector('[name="quantity"]');
        return quantityInput ? quantityInput.value : "1";
    }
}

class CartDispatcher {
    constructor() {
        this.cartToken = (lqd && lqd.cart.token) || utils.cookie.get('cart');
        this.selectors = {
            productPrice: null,
            totalProductsPrice: null,
            cartSubtotal: null,
            cartDiscount: null
        };
        this.helpers = new Helpers();
        this.cart = new Cart();
        this.renderDiscounts = this.renderDiscounts.bind(this);
        this.renderOCUDiscounts = this.renderOCUDiscounts.bind(this);
    }

    renderDiscounts(token, items, selectors) {
        if (selectors) this.fillSelectors(selectors);
        if (this.shouldGetDiscounts(items) || !this.areAttributesPresent(items)) return;

        this.getDiscounts(token, items)
            .then(function(res) {
                const lineItems = res.data.discounts.lineItems;

                lineItems.map(function(lineItem) {
                    if (lineItem.price === lineItem.discountedPrice) return;

                    this.fillDiscountedPrice(lineItem);
                    this.fillItemTotal(lineItem);
                }.bind(this));

                this.fillCartSubtotal(res.data.discounts.subtotal);
                this.fillCartDiscount(res.data.discounts.progressiveDiscount)
            }.bind(this))
            .catch(function(error) {
                console.log(error)
            })
    }

    getDiscounts(token, items) {
        const url = '/pre_purchase/v1/cart_discounts';
        const endpoint = window.OCUIncart && OCUIncart.appEndpoint;
        const headers = {
            'Content-Type': 'application/json',
            'Shop-Domain': lqd.permanent_domain
        };
        const payload = this.helpers.getCartItems(items || lqd.cart.items);
        payload.cart_token = this.cartToken || token;
        payload.currency_rate = (window.Shopify && Shopify.currency && +Shopify.currency.rate) || 1;

        if (!payload.cart_token) return Promise.reject(new Error('Cart Token is Missing'));

        return axios.post(endpoint + url, payload, { headers: headers });
    }

    doesUrlMatch(requestURL) {
        const cartUrls = ['add', 'update', 'change', 'clear'];

        return cartUrls.some(url => requestURL && requestURL.includes(`/cart/${url}`));
    }

  	shouldCartRequest(requestURL) {
        if (!requestURL) return false;

        const isNotICURequest = !/\/cart.(js|json)\?icu/.test(requestURL) // handle case with looping cart requests when In Cart Upsell & Cross Sell and OCU apps enabled

        return requestURL.includes('/cart.js') && !requestURL.includes('/cart.js?ocu') && isNotICURequest;
  	}

  	shouldRequest(requestURL) {
        if (!requestURL) return false;

      	return this.doesUrlMatch(requestURL) || this.shouldCartRequest(requestURL);
  	}

  	shouldGetDiscounts(items) {
        const cartItems = this.helpers.getCartItems(items || lqd.cart.items).line_items;

        return cartItems.every(function(cartItem) {
            if (!cartItem.properties) return;
            return cartItem.properties._ocu_offer_id === undefined;
        }.bind(this));
    }

    areAttributesPresent(items) {
        const cartItems = this.helpers.getCartItems(items || lqd.cart.items).line_items;

        return cartItems.some(item => {
            const wasEl = document.querySelector(`${this.selectors.productPrice || '[data-ocu-price-block'}="${item.key}"]`);
            const totalEl = document.querySelector(`${this.selectors.totalProductsPrice || '[data-ocu-total-block'}="${item.key}"]`);
            const subtotalEl = document.querySelector(this.selectors.cartSubtotal || '[data-ocu-subtotal]');
            const cartDiscountEl = document.querySelector(this.selectors.cartDiscount || '[data-ocu-cart-discount]');

            return !!wasEl || !!totalEl || !!subtotalEl || !!cartDiscountEl;
        })
    }

    fillDiscountedPrice(lineItem) {
        const wasPriceEls = document.querySelectorAll(`${this.selectors.productPrice || '[data-ocu-price-block'}="${lineItem.key}"]`);

      	wasPriceEls.forEach(wasPriceEl => {
            if (!wasPriceEl) return;

      		const formattedDiscountedPrice = this.getCurrency(lineItem.discountedPrice, OCUIncart.money_format);
        	const formattedOriginalPrice = this.getCurrency(lineItem.price, OCUIncart.money_format);

        	wasPriceEl.innerHTML = `<del style="padding-right:16px">${formattedOriginalPrice}</del><span>${formattedDiscountedPrice}</span>`;
      	});
    }

    fillItemTotal(lineItem) {
        const totalEls = document.querySelectorAll(`${this.selectors.totalProductsPrice || '[data-ocu-total-block'}="${lineItem.key}"]`);

        totalEls.forEach(totalEl => {
            if (!totalEl) return;

            totalEl.innerHTML = this.getCurrency(lineItem.discountedPrice * lineItem.quantity, OCUIncart.money_format);
        });
    }

    fillCartSubtotal(subtotal) {
        const subtotalEls = document.querySelectorAll(this.selectors.cartSubtotal || '[data-ocu-subtotal]');

        subtotalEls.forEach(subtotalEl => {
            if (!subtotalEl) return;

            subtotalEl.innerHTML = this.getCurrency(subtotal, OCUIncart.money_format);
        });
    }

    fillCartDiscount(discount) {
        if (discount === 0) return;
        const cartDiscountEls = document.querySelectorAll(this.selectors.cartDiscount || '[data-ocu-cart-discount]');

        cartDiscountEls.forEach(cartDiscountEl => {
            if (!cartDiscountEl) return;

            cartDiscountEl.innerHTML = `-${this.getCurrency(discount, OCUIncart.money_format)}`;
        });
    }

    getCurrency(price, format) {
        const currencyCode = (window.Shopify && Shopify.currency && +Shopify.currency.active) || 'USD';
        return Shopify.formatMoney && Shopify.formatMoney(price, format) || window.OCUApi.currency(price/100, format, currencyCode);
    }

    fillSelectors(selectors) {
        this.selectors.productPrice = `[${selectors.productPrice}`;
        this.selectors.totalProductsPrice = `[${selectors.totalProductsPrice}`;
        this.selectors.cartSubtotal = `[${selectors.cartSubtotal}]`;
        this.selectors.cartDiscount = `[${selectors.cartDiscount}]`;
    }

    renderOCUDiscounts(selectors) {
        cart.get('?ocu')
            .then((res) => {
                this.renderDiscounts(res.data.token, res.data.items, selectors);
            })
    }
}

const cart = new Cart();
const cartDispatcher = new CartDispatcher();
const open = window.XMLHttpRequest.prototype.open;
const originSend = window.XMLHttpRequest.prototype.send;

const openReplacement = function(method, url) {
    this.addEventListener('load', function () {
        if (cartDispatcher.shouldRequest(this._url)) {
            cart.get('?ocu')
                .then(function(res) {
                    cartDispatcher.renderDiscounts(res.data.token, res.data.items);
                });
        }
    });

    if (window.simplyInsurance) this._url = url; // integration with Simply Insurance
    return open.apply(this, arguments);
}

const fetchReplacement = function(ns, fetch) {
    if (typeof fetch !== 'function') return;

    ns.fetch = function() {
        const response = fetch.apply(this, arguments);

        response.then(function(res) {
            if (cartDispatcher.shouldRequest(res.url)) {
                cart.get('?ocu')
                    .then(function(res) {
                        cartDispatcher.renderDiscounts(res.data.token, res.data.items);
                    });
            }
        });

        return response;
    }
}

fetchReplacement(window, window.fetch);

window.XMLHttpRequest.prototype.open = openReplacement;

if (!window.OCUApi) window.OCUApi = {};
window.OCUApi.renderOCUDiscounts = cartDispatcher.renderOCUDiscounts;

class Currency {
    constructor() {
        this.currenciesWithoutDec = [
            'BYR',
            'XAF',
            'XPF',
            'CLP',
            'KMF',
            'JPY',
            'PYG',
            'RWF',
            'KRW',
            'VND',
            'VUV',
            'XOF',
            'MGA',
            'UGX',
            'ISK'
        ];

        this.entities = {
            '&nbsp;': ' ',
            '&pound;': '£',
            '&euro;': '€',
            '&dollar;': '$'
        };

        this.types = {
            amount: [2, ',', '.'],
            amount_no_decimals: [2, ',', '.'],
            amount_with_comma_separator: [2, '.', ','],
            amount_no_decimals_with_comma_separator: [2, '.', ','],
            amount_with_space_separator: [2, ' ', ','],
            amount_no_decimals_with_space_separator: [2, ' ', ','],
            amount_with_apostrophe_separator: [2, '\'', '.'],
            get default() {
                return this.amount;
            }
        };

        this.currency = this.currency.bind(this);
    }

    round(x, precision = 1) {
        let m = 10 ** precision;
        return Number.isInteger(x) ? (x * m) / m :  Math.round(x * m) / m;
    }

    thousand(x) {
        if (isNaN(x)) return x;
        if (x === 0) return x;
        if (x < 999) return (Math.round(x * 100) / 100);
        if (x < 9999) return this.round((Math.round(x * 10) / 10000), 0) + 'k';
        if (x < 1000000) return this.round((Math.round(x * 10) / 10000), 0) + 'k';
        if (x < 10000000) return this.round((Math.round(x * 10) / 10000000), 0) + 'm';
        if (x < 1000000000) return this.round(Math.round((x * 10 / 10000000)), 0) + 'm';
        if (x >= 1000000000) return this.round(Math.round((x * 10 / 10000000000)), 0) + 'b';
    }

    replaceCharEntity(text) {
        const replacer = (key) => this.entities[key] !== null && this.entities[key] !== undefined ? this.entities[key] : key;
        return text && text.replace(/(&\w+;)/g, replacer) !== null && text.replace(/(&\w+;)/g, replacer) !== undefined ? text.replace(/(&\w+;)/g, replacer) : text;
    }

    type(key) {
        const match = /\{\{\s*(\w+)\s*\}\}/.exec(key) && /\{\{\s*(\w+)\s*\}\}/.exec(key)[1];
        return this.types[match] !== null && this.types[match] !== undefined ? this.types[match] : this.types.default;
    }

    toFixed(value, precision) {
        let power = Math.pow(10, precision);

        return (Math.round((value + 1e-8) * power) / power).toFixed(precision);
    }

    formatNumber(number, opts, args) {
        if (!+number && +number !== 0) return '&mdash;';
        let suffix;
        let k = args.includes('thousand');
        const noCurrency = args.includes('noCurrency');
        let currencyCode = args.find(arg => this.currenciesWithoutDec.includes(arg)) || noCurrency;
        const noPrecision = args.includes('noPrecision');

        if (k) {
            number = this.thousand(+number);
            suffix = /\d+\.?\d*([k-m])/.exec(number) && /\d+\.?\d*([k-m])/.exec(number)[1] || '';
            number = parseFloat(number);
        }

        opts = {
            precision: noPrecision ? 0 : opts[0],
            thousand: opts[1],
            decimal: opts[2]
        };

        let negative = number < 0 ? '-' : '';
        let base = parseInt(this.toFixed(Math.abs(number), opts.precision), 10) + '';
        let mod = base.length > 3 ? base.length % 3 : 0;

        let formatted = negative +
            (mod ? base.substr(0, mod) + opts.thousand : '') +
            base.substr(mod).replace(/(\d{3})(?=\d)/g, '$1' + opts.thousand) +
        (opts.precision > 0 ? opts.decimal + this.toFixed(Math.abs(number), opts.precision).split('.')[1] : '');

        if (suffix) formatted = formatted.replace(/([,.]00|0)$/, '') + suffix;

        return currencyCode && !suffix ? formatted.split(opts.decimal)[0] : formatted;
    }

    formatNumberForView(amount, format, ...args) {
        format = this.replaceCharEntity(format);

        const noCurrency = args.includes('noCurrency');
        const withCurrency = /\{\{\s*\w+\s*\}\}/;
        const withoutCurrency = /.*\{\{\s*\w+\s*\}\}.*/;
        const reg = noCurrency ? withoutCurrency : withCurrency;

        return format && format.replace(reg, this.formatNumber(amount, this.type(format), args));
    }

    currency(amount, format, ...args) {
        return this.formatNumberForView(amount, format, ...args);
    }
}

if (!window.OCUApi) window.OCUApi = {};
window.OCUApi.currency = new Currency().currency;

window.OCUIncart = {
    cart_items: null,
    subscription_tags: '',
    money_format: '',
    option_selection: '//cdn.shopify.com/shopifycloud/shopify/assets/themes_support/option_selection-fe6b72c2bbdd3369ac0bfefe8648e3c889efca213baefd4cfb0dd9363563831f.js',
    integrations: function(cartItems) {
        return new PrecheckoutIntegrations(cartItems);
    },

    metafields: {
        main:  || {},
        get general() {
            return this.main.general || {};
        },
        get settings() {
            return this.general.settings || {};
        },
        get triggers() {
            return this.general.triggers ? this.general.triggers.pre_checkout : {};
        },
        get types() {
            return this.triggers.metafields || {
                products: 'pre_checkout_product_ids',
                variants: 'pre_checkout_variant_ids'
            };
        },
        get products() {
            return this.getMetafields(this.types.products) || [];
        },
        get variants() {
            return this.getMetafields(this.types.variants) || [];
        },
        get proxy_url() {
            return this.settings.proxy_url || '/apps/secure-checkout';
        },
        get excluded() {
            const keys = this.triggers.metafields.excluded || { products: 'pre_excluded_product_ids' };

            return {
                products: []
            };
        },
        getMetafields: function(key) {
            return this.main[key];
        }
    },
    get triggers() {
        const funnels = this.funnels;
        const cartItems = this.cart_items;
        const integrations = this.integrations(cartItems);
        const adp = integrations.advancedProductOptions;
        const isEmptyCart = this.isEmptyCart;

        return {
            products: this.cart_items.map(function(item) { return item.product_id }),
            get variants() {
                const ids = cartItems.map(function(item) { return item.id });
                if (!adp.present) return ids;
                return ids.concat(adp.relations); // Advanced Product Options integration
            },
            get all() {
                if (!funnels.triggers.all) return;
                if (isEmptyCart) return true;

                return !!this.products.filter(function(trigger) {
                    return !~funnels.triggers.excluded.products.indexOf(trigger);
                }).length;
            }
        };
    },
    get funnels() {
        return {
            triggers: {
                all: this.metafields.triggers.all_products,
                excluded: this.metafields.excluded,
                variants: this.metafields.variants || [],
                products: this.metafields.products || [],
            },
            get types() {
                const exclude = /all|excluded/;
                return Object.keys(this.triggers).filter(function(key) {
                    return !exclude.test(key);
                });
            },
            get anyTriggers() {
                return this.types.some(function(type) {
                    return !!this.triggers[type]
                }.bind(this));
            }
        }
    },
    get is_precheckout() {
        const funnels = this.funnels;
        const triggers = this.triggers;

        if (triggers.all) return true;
        if (this._is_product_action && funnels.anyTriggers) return  true;

        return funnels.types.some(function(type) {
            return triggers[type].some(function(trigger) {
                return ~funnels.triggers[type].indexOf(trigger);
            });
        });
    },
    get hasOfferInCart() {
        return this.cart_items.find(function(item) {
            return item && item.properties && item.properties._ocu_offer_id;
        });
    },
    get settings() {
        return this.metafields.settings.popup_settings;
    },
    get proxy_url() {
        return this.metafields.proxy_url;
    },

    get appEndpoint() {
        return this.metafields.settings.app_endpoint;
    },

    get popup_location() {
        return this.metafields.general.settings.popup_locations;
    },
    get popupLocation() {
        return Object.entries(this.popup_location)
            .map(function(item) {
                if (item[1]) return item[0];
            });
    },
    get isEmptyCart() {
        return !this.cart_items.length && ~this.popupLocation.indexOf('product'); // check is empty cart and product location
    },
    get permanent_domain() {
        return lqd.permanent_domain;
    }
};

var lqd = {
    cart: null,
    path: '' === 'true' ? 'd56719fefdd75e95ba06caea3d9a3732' : '5965fedc7708e03e1024db4bf2ed5fe6',
    template_name: '',
    shop_currency: '',
    skip_cart: OCUIncart.metafields.general.integrations.skip_cart === 'true',
    cart_products_json: JSON.parse("[]"),
    cart_collections_json: [],
    cart_variants_json: [],
    customer_id: ,
    customer: { id: , email: '' },
    proxy_url: OCUIncart.metafields.general.settings.proxy_url,
    permanent_domain: '',
    current_domain: '',
    disabled_by_subscription_app: ,
    subscription_app_enabled: ,
    subscription_products_json: '',
    subscription_variants_json: '',
    subscription_products_size: ,
    integrate_with_recharge: '' === 'true',
    product: null,
    product_tags: null,
    amazon_pay: '' === 'true',
    themePopup: '' === 'true' || '' === 'true',
    root_url: '',
    themeSkipCart: '' === 'redirect_checkout'
        || '' === 'true'
        || '' === 'skip_cart',

    get is_precheckout() {
        return OCUIncart.is_precheckout;
    },
    get upsell_cart_include_subscription_upsells() {
        var self = this;

        var hasSubscription = this.product_tags.reduce(function(acc, tag) {
            return acc || ~self.postcheckout_tags.indexOf(tag.toLowerCase());
        }, false);

        return hasSubscription;
    },
    get isThemePopupTag() {
        return this.product && this.product.tags.some(function(tag) {
            return /cross-sell-\d/.test(tag);
        });
    },
    get isSkipCartPage() {
        return /index|collection|product/.test(this.template_name);
    },
    get isSkipCartCondition() {
        return (this.skip_cart || this.themeSkipCart) && this.isSkipCartPage && !this.isThemePopupTag;
    },
    get checkoutUrl() {
        return (this.root_url === '/' ? '' : this.root_url) + '/checkout';
    },
    get isPopupTriggerPage() {
        return OCUIncart.popupLocation && !!~OCUIncart.popupLocation.indexOf(lqd.template_name);
    }
};

lqd.cart_products_json = lqd.cart_products_json.filter(function(item) {
    return item.handle && !item.error;
});

utils.shareableDiscount({ clear:false });

if (lqd.is_precheckout) requireOptionSelectors();

var ocuCdn="https://d1u9wuqimc88kc.cloudfront.net";
function Application() {
    ajax = axios.create({ timeout: 8000 });
    ajax.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    new PublicMethod();
    new SkipCart();
    new HistoryApi();

    this.setAttributes();
}

Application.prototype = {
    checkout: null,
    ocuSelectors: utils.store.get('ocuSelectors'),
    integrations: new Integrations(),
    helpers: new Helpers(),
    // verify: new Verify(),
    cart: new Cart(),
    utils: new ApplicationsUtils(),
    popupDispatcher: new PopupDispatcher(),
    cartDispatcher: new CartDispatcher(),

    setAttributes: function() {
        if (/register|account|login|reset_password|search|^$/.test(lqd.template_name)) return;

        this.cartDispatcher.renderDiscounts();

        const forEach = Array.prototype.forEach;
        const checkoutButtons = document.querySelectorAll(this.ocuSelectors);
        const links = document.querySelectorAll('a'); // for ios

        forEach.call(checkoutButtons, function(item) {
            if (item.name === 'update') return;
            item.dataset.ocuCheckout = true;
        });

        forEach.call(links, function(link) {
            var isNeededHref = utils.store.get('permalink').test(link.href);
            if (isNeededHref) link.dataset.ocuCheckoutLink = true;
        });

        this.listenEvents();
        setTimeout(this.helpers.showCheckoutButton);
    },

    check: function(event, target) {
        this.prevent(event);

        var form = target.closest('[action="/cart"], [action="/checkout"]');
        if (form && !this.validate(form)) {
            clearTimeout(utils.store.get('fallback').id);
            utils.store.set('submitted', false);
            return form.reportValidity();
        }
        if (!utils.store.get('cartChanged')) return this.handle(target);

        // utils.store.listen('cartChanged').then(function() {this.handle(target)}.bind(this));
    },

    handle: function(target) {
        this.integrations.discounts();

        if (utils.store.get('checkoutButtonState')) return;
        // if (utils.store.get('submitted')) return; // TODO fix_ff_multi_requests_2384
        utils.store.set('checkoutButtonState', true);

        this.helpers.payPal(target);
        this.checkout({ redirect: true });
        // this.verify.init(target);
    },

    init: function(event, target) {
        var self = this;

        if (OCUApi.onCheckout && OCUApi.onCheckout()) return;

        if (lqd.template_name === 'cart' && utils.store.get('submitted')) {
            event.stopPropagation();
            return event.preventDefault();
        }
        utils.store.set('submitted', true);

        this.fallbackRedirect();

        if (window.RevyApp) this.handleMonkeyPatching();

        if (!this.allowUpsells(target)) return;

        if (lqd.template_name === 'product' && target.name === 'add' && !target.closest('form[action$="/cart/add"]')) {
            const form = document.querySelector('form[action$="/cart/add"]');

            if (!form) return this.helpers.clearFallback();

            event.preventDefault();
            event.stopPropagation();
            return form.submit();
        }
        const anyPrePurchases = window.OCUIncart && (OCUIncart.singleUpsells || OCUIncart.multipleUpsells);
        if (anyPrePurchases) {
            // self.prevent(event, true);
            return this.popupDispatcher.proceed(event, target, self);
        }

        const addBtn = this.popupDispatcher._isAddAction(target);
        if (!anyPrePurchases && lqd.isPopupTriggerPage && addBtn) return clearTimeout(utils.store.get('fallback').id);

        if (target.dataset.customBuyNow) {
            self.prevent(event);

            var id = target.dataset.varientId;
            var qty = target.dataset.itemQuantity;
            var data = { id: id, quantity: qty };
            var handle = function() { self.checkout({ redirect:true }) };
            var onError = function() { alert('Network Error') };

            this.cart.add(null, null, data).then(handle).catch(onError);
        }

        return this.check(event, target);
    },

    prevent: function(event, immediate) {
        event.preventDefault();
        event.stopPropagation();
        if (immediate) event.stopImmediatePropagation();
    },

    validate: function(form) {
        var elems = form.querySelectorAll('[type="text"], [type="checkbox"], select, textarea');

        var requiredElems = Array.prototype.filter.call(elems, function(el) {
            if (el && ~utils.store.get('excludedRequiredFormIds').indexOf(el.form.id)) return false;

            return el && el.required;
        });

        if (!requiredElems.length) return true;

        return !requiredElems.some(function(el) {
            return !el.checkValidity();
        });
    },

    allowUpsells: function(el) {
        // if (window.mixed_cart) return; //integration with Recurring Orders & Subscriptions by Bold
        if (window.popup_upsell && !document.querySelector('#upsellclosebtn')) return; // integration with Product Upsell
        if (window.ol_checkout_ok instanceof Function && !ol_checkout_ok()) return; // integration with OrderLogic
        if (el.dataset.zpaSubmitButton === '') return; // integration with ZipifyPages CRM popup

        return true;
    },

    fallbackRedirect: function() {
        var fallback = utils.store.get('fallback');
        fallback.id = setTimeout(function() { this.checkout({ redirect:true }) }.bind(this), fallback.timeout);
        utils.store.set('fallback', fallback);
    },

    handleMonkeyPatching: function() {
        const send = utils.store.get('XHR').send;

        if (XMLHttpRequest.prototype.send !== send) {
            XMLHttpRequest.prototype.send = send;
        }
    },

    handleClick: function(e) {
        if (lqd.template_name === 'page' && !e.isTrusted) return;

        if (e.target.name === 'update' || e.target.closest('[name="update"]')) return;

        if (!lqd.amazon_pay && e.target.closest('form[action^="https://payments.amazon"]')) return;

        if (this.helpers.zpPreventRedirect(e.target)) return;

        if (this.helpers.isBuyNow(e) && !lqd.isPopupTriggerPage) return new BuyNow(e);

        if (this.helpers.isCartPopupRedirectsToCart(e)) return;

        if (OCUIncart.integrations().minMaxify.invalid) return;

        // if (this.helpers.checkDirectCheckoutButtons(e.target)) {
        //     e.target.dataset.ocuCheckout = true;
        //     utils.store.set('redirect_url', '/checkout');
        // }

        if (e.target.dataset.ocuCheckoutLink || e.target.closest('[data-ocu-checkout-link]')) {
            e.preventDefault();
            var href = (e.target.dataset.ocuCheckoutLink ? e.target : e.target.closest('[data-ocu-checkout-link]')).href;
            if (utils.store.get('isPermalinkHandling')) return;
            utils.store.set('isPermalinkHandling', true);
            var result = this.integrations.handlePermalink(href, 'redirect');
            return result.promise.then(result.callback);
        }

        if ((e.target.dataset.skipCart === 'true' || e.target.closest('[data-skip-cart]')) && utils.store.get('submitted')) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return;
        }

        OCUIncart.integrations().salesRocket.setup();

        var target = this.helpers.checkSelector(e.target);
        if (lqd.isPopupTriggerPage) target = this.helpers.checkAddToCart(e.target) || target;
        if (target) this.init(e, target);
    },

    handleMousedown: function(e) {
        var self = this;

        if (e.target.dataset.skipCart !== 'true' && !e.target.closest('[data-skip-cart]')) return;

        if (e.target.name === 'update' || e.target.closest('[name="update"]')) return; // 283fa429

        if (this.helpers.zpPreventRedirect(e.target)) return;

        var amazonForm = e.target.closest('form[action^="https://payments.amazon"]');
        if (amazonForm && lqd.amazon_pay) {
            e.preventDefault();
            e.stopPropagation();

            var path = {
                ocu: lqd.proxy_url + '/amazon/forward',
                shopify: amazonForm.querySelector('[name="redirectURL"]').value
            };

            var handle = function() {
                self.checkout()
                    .then(function(res) { location = path[res.status ? 'ocu' : 'shopify'] })
                    .catch(function(res) { location = path.shopify })
            };

            var onError = function(form) {
                form.submit();
            };

            if (!e.target.closest('form[action="/cart/add"]')) return handle();

            var cart = document.querySelector('form[action="/cart/add"]');
            var button = amazonForm.querySelector('[type="submit"]');
            return self.cart.add(cart, button, path).then(handle).catch(onError.bind(null, amazonForm));
        }

        var form = e.target.closest('form[action="/cart/add"]') || document.querySelector('form[action="/cart/add"]');
        var button = e.target.dataset.skipCart === 'true' ? e.target : e.target.closest('[data-skip-cart]');

        if (!form) return;

        e.preventDefault();
        e.stopPropagation();
        utils.store.set('submitted', true);

        var handle = function() { self.checkout({ redirect:true }) };
        var onError = function(form) { form.submit(); };
        return self.cart.add(form, button).then(handle).catch(onError.bind(null, form));
    },

    handleFocus: function() {
        // handle cart drawers focus event for iOS select
        window.addEventListener('focus', function(e) {
            e.stopImmediatePropagation();
        }, true);
    },

    listenEvents: function() {
        const touchEventConfig =  {
            capture: true,
            passive: false
        };

        const onClick = function(e) {
            if (window.OCUDisableEvents) return;
            this.handleClick(e);
        }.bind(this);

        document.addEventListener('mousedown', this.integrations.amazonPay.bind(this), true);
        document.addEventListener('touchstart', onClick, touchEventConfig);
        document.addEventListener('click', onClick, true);
        window.addEventListener('pagehide', this.helpers.disableButtons);

        window.addEventListener('locationchange', function() {
            document.removeEventListener('click', onClick, true);
            document.addEventListener('click', onClick, true);
        }.bind(this));

        window.addEventListener('pageshow', function(e) {
            if (e.persisted) location.reload();
            this.helpers.disableButtons();
        }.bind(this));

        // if (lqd.template_name !== 'cart') return;
        // document.addEventListener('mousedown', this.cart.update.bind(this), true);
        // document.addEventListener('change', this.cart.state.bind(this));
    }
};

function ZipifyPages() {
    const KEY = 'ocu_integration_data';

    this.setProducts = products => {
        this.products = products;
    }

    this.setBlockId = id => {
        this.block_id = id;
    }

    this.getProduct = () => this.product;

    this.appendZipifyPagesProduct = items => {
        if (!this.products) return items;

        const hash = this.products.find(product => product.discountHash)?.discountHash;

        return items.map(item => {
            const matchedItem = this.products.find(product => product.productData.key === item.key);

            if (!matchedItem) return item;
            if (!matchedItem?.discountData.includes('dynamic')) return item;

            const zpPayload = {
                pages: true,
                discount_hash: hash,
                block_id: this.block_id
            };

            item.properties = {
                ...item.properties,
                ...zpPayload
            };
            return item;
        });
    }

    this.init = () => {
        try {
            this.sessionData = JSON.parse(sessionStorage.getItem(KEY));

            if (this.sessionData && this.sessionData.token !== lqd.cart.token) {
                this.sessionData = null;
                sessionStorage.removeItem(KEY);
            }
        } catch (e) {
            console.error(e);
        }
    }
    this.handleZPOutsidePage = (ctx, callback) => {
        try {
            const payload = JSON.stringify({ products: this.products, block_id: this.block_id, token: lqd.cart.token });
            sessionStorage.setItem(KEY, payload);
            callback({ detail: {} });
        } catch(e) {
            console.error(e);
            this._verifyFallback(ctx, callback);
        }
    };

    this._verifyFallback = (ctx, callback) => {
        ctx.cart.get()
            .then(response => {
                OCUIncart.cart_items = response.data.items;
                ctx.verify()
                    .then(() => {
                        callback({ detail: {} });
                    });
            });
    }

    this.clear = () => {
        this.products = null;
    }

    this.isBlockOutsideProductPage = () => !lqd.isPopupTriggerPage && this.products.some(product => product.discountHash);

    this.init();
}

function amazonPay(e) {
    const self = this;
    const amazonForm = e.target.closest('form[action^="https://payments.amazon"]');

    if (!amazonForm || !lqd.amazon_pay) return;

    e.preventDefault();
    e.stopPropagation();

    utils.store.set('amazonPayInitiated', true);

    const addForm = e.target.closest('form[action="/cart/add"]');
    const path = lqd.proxy_url + '/amazon/forward';

    const getToken = function(url) {
        const escaped = lqd.proxy_url.replace(/\//g, '\\/');
        const reg = new RegExp(escaped + '\\/((?:\\w+[-_]?)+)\\/?');
        const match = reg.exec(url);

        return match && match[1];
    };

    const fallback = function() {
        amazonForm.submit();
    };

    const onSuccess = function(res) {
        if (!res.status) return fallback();

        const token = getToken(res.checkout_url);
        if (!token) return fallback();

        utils.cookie.set('ocu_checkout_token', token);
        location.assign(path);
    };

    if (!addForm) {
        return self.checkout().then(onSuccess).catch(fallback);
    }

    const cart = document.querySelector('form[action="/cart/add"]');
    const button = amazonForm.querySelector('[type="submit"]');

    self.cart.add(cart, button)
        .then(self.checkout)
        .then(onSuccess)
        .catch(fallback);
}

function Bold() {
    this.isBoldRecuring = function() {
        var boldRecurringEl = document.querySelector('[data-bold-recurring]');
        var isBoldRecuring = boldRecurringEl && boldRecurringEl.checked;
        return isBoldRecuring;
    };

    this.upsellPopup = function(target) {
        var modalButtons = [
            target.querySelector('[data-bold-component-id="upsell_continue"]'),
            target.querySelector('[data-bold-component-id="upsell_no_thanks"]'),
            target.querySelector('#bold-modal__btn-close')
        ];

        modalButtons.forEach(function(item) {
            if (!item) return;
            item.addEventListener('click', function(e) {
                setTimeout(function() {
                    self.checkout({ redirect: true });
                }, 500);
            });
        });
    };

    this.initRecurring = function() {
        var clones = document.querySelectorAll('[data-ocu-clone]');
        var clone = Array.prototype.filter.call(clones, function(i) { return i && !i.dataset.ocuCheckout; })[0];
        if (clone) clone.click();
    };

    this.redirect = function(event) {
        if (!window.BOLD || !BOLD.recurring_orders || !BOLD.recurring_orders.app || !event.isTrusted) throw new Error('Bold Recurring not found');
        if(!BOLD.common.cartDoctor.cart.is_recurring) throw new Error('Bold Recurring cart error');

        event.preventDefault();
        event.stopImmediatePropagation();
        BOLD.recurring_orders.app.cartWidget.checkoutEvent = event;
        BOLD.recurring_orders.app.cartWidget.checkRecurringCheckout(event);
    };

    this.recurring = function(form, token) {
        var cfg = {
            protocol: 'https://',
            host: 'recurringcheckout.com',
            proxy: '/s/',
            permanent: /(\w+)\.myshopify\.com/.exec(BOLD.common.Shopify.shop.permanent_domain)[1],
            path: '/checkout/recurring/',
            query: '?shop_url=' + location.host
        };

        form.action = cfg.protocol + cfg.host + cfg.proxy + cfg.permanent + cfg.path + token + cfg.query;
        form.submit();
    };
}

function BuyNowBtns() {
    if (!lqd.themeSkipCart) return;

    const self = this;

    const buyNowBtn = document.querySelector('button[id="AddToCart"]');
    if (!buyNowBtn) return;

    const innerTextEl = buyNowBtn.querySelector('#AddToCartText');
    if (!/buy\s*(it)?\s*now/i.test(innerTextEl && innerTextEl.innerText)) return;

    const cb = function() { self.checkout({ redirect: true }); };
    const onError = function(form) { form.submit() };

    buyNowBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const form = buyNowBtn.closest('form[action="/cart/add"]');
        self.cart.add(form, e.target).then(cb).catch(onError.bind(null, form));
    });
}

function HandlePermalink(url, redirect) {
    var self = this;
    var reg = utils.store.get('permalink');
    var match = reg.exec(url);
    var cfg = { redirect: redirect };

    if (!match) return {
        promise: new Promise(function(resolve) { resolve({ checkout_url: url }); }),
        callback: function(res) {
            return redirect ? location.assign(url) : new Promise(function(resolve) { resolve(res); })
        }
    };

    var discount = match[2];
    if (discount) cfg.params = [{ discount: discount }];

    var groups = match[1].split(',');

    var data = groups.reduce(function(acc, item, i, arr) {
        var id = +item.split(':')[0];
        var qty = +item.split(':')[1];

        var cartItem = lqd.cart_variants_json.filter(function(item) { return item.id === id })[0];
        if (cartItem) qty += cartItem.quantity;

        if (acc) acc += '&';
        return acc += 'updates[' + id + ']=' + qty;
    }, '');

    return {
        promise: self.cart.bulkAdd(data),
        callback: function() { return self.checkout(cfg); }
    };
}

function CartDrawer(target) {
    var form = target.querySelector('form[action="/cart"]');
    var btn = form && form.querySelector('input[type="submit"]');
    if (!btn) return;

    btn.type = 'button';
    btn.addEventListener('click', function(e) {
        self.checkout({ redirect: true });
    });
}

function CartPopup() {
    var btn = document.querySelector('.bkt--upsell-target-checkout');
    if (!btn) return;

    var cfg = {
        tag: 'input ',
        type: 'type="button" ',
        style: 'style="position:absolute;left:0;top:0;width:100%;height:100%;cursor:pointer;opacity:0" ',
        data: 'data-ocu-dialog-btn '
    };

    btn.style.position = 'relative';
    btn.insertAdjacentHTML('beforeend','<'+cfg.tag+cfg.type+cfg.style+cfg.data+'>');

    var clone = document.querySelector('[data-ocu-dialog-btn]');
    clone.addEventListener('click', function(e) {
        e.stopPropagation();
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="bkt--nc-icon" x="0px" y="0px" width="64px" height="15px" viewBox="0 0 64 64"><g><circle class="nc-dots-7-2" data-color="color-2" fill="#445FFF" cx="32" cy="32" r="26" transform="translate(6.26687999999989 6.26687999999989) scale(0.8041600000000034)" style="opacity:0.8041600000000034"></circle><circle class="nc-dots-7-1" fill="#445FFF" cx="-72" cy="32" r="26" transform="translate(3.2332800000000272 12.933120000000109) scale(0.5958399999999966)" style="opacity:0.5958399999999966"></circle><circle class="nc-dots-7-3" fill="#445FFF" cx="132" cy="32" r="26" transform="translate(33.6 19.2) scale(0.4)" style="opacity:0.4"></circle></g></svg>';
        function setAttributes(e,t){for (var i in t)e.setAttribute(i,t[i]);} function dotsSevenStep(e){startDots7||(startDots7=e);var t=e-startDots7,n=Math.min(t/250,4);n=4==n?0:n,decimalRot=n%1,upperInteger=Math.ceil(n),1e3>t||(startDots7+=1e3);if (circleDots7[0][0]){window.requestAnimationFrame(dotsSevenStep);var a=[],r=[],o=[],s=[-72,32,132],c=[32,32,32];for (j = 0;  circleDots7Number > j ; j++) {for (a[0]=a[1]=a[2]=.4,1==upperInteger?(a[0]=1-3*decimalRot/5,a[1]=.4+3*decimalRot/5):2==upperInteger?(a[1]=1-3*decimalRot/5,a[2]=.4+3*decimalRot/5):3==upperInteger?(a[1]=.4+3*decimalRot/5,a[2]=1-3*decimalRot/5):4==upperInteger?(a[0]=.4+3*decimalRot/5,a[1]=1-3*decimalRot/5):a[0]=1,i=0;3>i;i++)r[i]=(1-a[i])*s[i],o[i]=(1-a[i])*c[i],setAttributes(circleDots7[i][j],{
transform: 'translate('+r[i]+' '+o[i]+') scale('+a[i]+')',
style: 'opacity:'+a[i]+';'
});}}}!function(){var e=0;window.requestAnimationFrame||(window.requestAnimationFrame=function(t){var i=(new Date).getTime(),n=Math.max(0,16-(i-e)),a=window.setTimeout(function(){t(i+n);},n);return e=i+n,a;});}();var circleDots7=[],startDots7=null;circleDots7[0]=document.getElementsByClassName('nc-dots-7-1'),circleDots7[1]=document.getElementsByClassName('nc-dots-7-2'),circleDots7[2]=document.getElementsByClassName('nc-dots-7-3'),circleDots7Number = circleDots7[0].length,window.requestAnimationFrame(dotsSevenStep);
        self.checkout({ redirect: true });
    });
}

function CheckoutLinks() {
    var checkoutLinks = document.querySelectorAll('a[href="/checkout"]');

    Array.prototype.forEach.call(checkoutLinks, function(link) {
        if (!link) return;

        link.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            self.checkout({ redirect: true });
        });
    });
}

function Discounts() {
    var discount = document.querySelector('input[name="discount"]');
    var discountCC = utils.cookie.get('discount_code'); // integration with CouponCountdown
    var discountShare = utils.cookie.get('ocu-share-discount');
    var isPopupShown = utils.cookie.get('popupcookie');

    if (window._chpmgr && !isPopupShown) return; // integration with chilliapps exit popup
    if (!discount && !discountCC && !discountShare) return;

    var code;
    if (discount) code = discount.value;
    if (discountCC) {
        code = discountCC;
        utils.cookie.remove('discount_code');
    }

    if (discountShare) {
        code = discountShare;
        utils.cookie.remove('ocu-share-discount');
    }

    var param = {
        name: 'discount',
        value: encodeURIComponent(code)
    };

    var params = utils.store.get('params');

    if (discountShare && lqd.template_name === 'page' || !param.value) return; // zp & shareable discount

    params.arr.push(param);
    utils.store.set('params', params);
}

function Recharge() {
    var self = this;

    this.isSubscription = function(res) {
        const cart = res.cart || res.data.cart || res.data;

        return cart.items.some(function(item) {
            if (item.selling_plan_allocation) return null;
            return item.properties && (item.properties.subscription_id || item.properties.shipping_interval_frequency);
        });
    };

    this.processCart = function() {
        window.reChargeProcessCart = function() {
            self.checkout({ redirect: true });
        };
    };

    this.redirect = function(event, cart, checkoutUrl) {
        let checkout_url = "https://checkout.rechargeapps.com";
        function buildCheckoutUrl(){var t=["myshopify_domain="+Shopify.shop];return checkout_url+"/r/checkout?"+(t=t.concat(get_cart_token()).concat(get_ga_linker())).join("&")}function filterVisible(t){return t.filter(function(t){return!!(t.offsetWidth||t.offsetHeight||t.getClientRects().length)})}function filterValues(t){return t.filter(function(t){var e="radio"===t.getAttribute("type")&&t.checked,n="checkbox"===t.getAttribute("type")&&t.checked,r="checkbox"!==t.getAttribute("type")&&"radio"!==t.getAttribute("type");return!!t.value&&(r||e||n)})}function getCartJSON(){return fetch("/cart.js").then(function(t){return t.json()}).then(function(t){return{cart:JSON.stringify(t)}}).catch(function(t){return console.error("Error retreiving cart: ",t),{cart:{}}})}function getTermsAndConditions(){var t=document.querySelectorAll(["#terms","#agree"].join(",")),e=filterValues(Array.prototype.slice.apply(t)).map(function(t){return t.value});return e.length?{terms_and_conditions:e.join(", ")}:{}}function getNotes(){var t=document.querySelectorAll(['[name="note"]'].join(",")),e=filterVisible(Array.prototype.slice.apply(t)).map(function(t){return t.value}),n=new URLSearchParams(decodeURIComponent(window.location.search)).get("note");return n&&e.push(n),e.length?{note:e.filter(function(t,e,n){return n.indexOf(t)===e}).join(", ")}:""}function getUTMAttributes(){var t=/^_shopify_sa_p/,e=/^utm_/,n=/^_shopify_sa_t/,r={},o="",i="";document.cookie.split(";").map(function(t){return t.trim()}).forEach(function(e){t.test(e)&&(o=e),n.test(e)&&(i=decodeURIComponent(e.split("=")[1]))});var c=o.split("=")[1];if(decodeURIComponent(c).split("&").forEach(function(t){var n=t.split("=")[0],o=t.split("=")[1];if(e.test(n))return r[n]=o}),Object.keys(r).length)return r.utm_timestamp=i,r.utm_data_source="shopify_cookie",r}function getAttributes(){var t=/attributes\[(.*?)\]/,e=/\[(.*?)\]/,n=document.querySelectorAll(['[name*="attributes"]'].join(",")),r=filterValues(Array.prototype.slice.apply(n)),o={},i=getUTMAttributes(),c=new URLSearchParams(decodeURIComponent(window.location.search));for(let n of c)if(t.test(n[0])){var u=n[0].match(e)[0];u=u.substring(1,u.length-1),o[u]=c.get(n[0])}return r.forEach(function(n){var r=n.getAttribute("name"),i=n.value;if(t.test(r)){var c=r.match(e)[0];return c=c.substring(1,c.length-1),o[c]=i}return o[r]=i}),i&&Object.keys(i).forEach(function(t){o[t]=i[t]}),Object.keys(o).length?{attributes:Object.assign({},o)}:{}}function getCartData(){return getCartJSON().then(function(t){var e={};return[getTermsAndConditions(),getNotes(),getAttributes(),e=t].forEach(function(t){Object.assign(e,t)}),e})}function get_cart_token(){try{return["cart_token="+(document.cookie.match("(^|; )cart=([^;]*)")||0)[2]]}catch(t){return[]}}function get_ga_linker(){try{return[ga.getAll()[0].get("linkerParam")]}catch(t){return[]}}function buildInputs(t,e){Object.keys(e).forEach(function(n){var r=document.createElement("input");r.setAttribute("type","hidden"),r.setAttribute("name",n),r.setAttribute("value","object"==typeof e[n]?JSON.stringify(e[n]):e[n]),t.appendChild(r)})}function buildForm(t,e){var n=document.createElement("form");return n.setAttribute("method","post"),n.setAttribute("action",e),n.setAttribute("id","rc_form"),n.style.display="none",buildInputs(n,t),n}function hasSubscription(t){return[...JSON.parse(t.cart).items].some(t=>t.properties && (t.properties.shipping_interval_unit_type || t.properties.shipping_interval_frequency))}function ReChargeCartSubmit(){return getCartData().then(function(t){if(hasSubscription(t)){var e=buildCheckoutUrl();if(t){var n=new XMLHttpRequest;n.open("POST","/cart/update.js"),n.setRequestHeader("Content-Type","application/json"),n.onload=function(){200===n.status?window.console.log("done",JSON.parse(n.responseText)):200!==n.status&&window.console.log("fail",JSON.parse(n.responseText));var r=buildForm(t,e);document.body.appendChild(r),r.submit()},n.send(JSON.stringify(t))}else window.location.href=e}else window.location.href=checkoutUrl||"/checkout"})}
        ReChargeCartSubmit();
    };
}

function smar7() {
    var self = this;

    var isSmar7Installed = ~document.head.innerHTML.indexOf('bundle-upsell');
    if (!isSmar7Installed) return;

    var ctaBtns = document.querySelectorAll("[name='checkout'], [href^='/checkout'], form[action='/checkout'] [type='submit'], #checkout, [name='goto_pp'], .checkout_button");
    Array.prototype.forEach.call(ctaBtns, function(btn) {
        btn.disabled = true;
    });

    var i = 0;
    var int = setInterval(function() {
        if ((++i && i > 7) || (window.SMAR7 && SMAR7.bundle)) {
            Array.prototype.forEach.call(ctaBtns, function(btn) {
                btn.disabled = false;
            });
            clearInterval(int);
        }
    }, 3000);

    var redirect = function(discount) {
        var button, path, params = utils.store.get('params');

        if (discount) {
            SMAR7.util.setCookie('smar7coupon', discount, 3600);

            params.arr.push({
                name: 'discount',
                value: encodeURIComponent(discount)
            });
        } else {
            discount = SMAR7.bundle.helper.determineCoupon && SMAR7.bundle.helper.determineCoupon();
        }

        if (SMAR7.paypal) {
            path = '/checkout?goto_pp=paypal_express&discount=' + encodeURIComponent(discount);
            button = document.querySelector('[name="goto_pp"]');
        } else {
            path = '/checkout?discount=' + encodeURIComponent(discount);
            button = document.querySelector(
                '[name="checkout"], [href="/checkout"], form[action="/checkout"] input[type="submit"], #checkout'
            );
        }

        utils.store.set('params', params);
        self.checkout({ redirect: true });
    };

    var handle = function() {
        if (window.SMAR7 && SMAR7.bundle) SMAR7.bundle.redirect = redirect;
    };

    document.addEventListener('click', handle, true);
};

function Integrations() {
    const self = this;
    const bold = new Bold();
    const recharge = new Recharge();
    const zipifyPages = new ZipifyPages();

    this.list = {
        bold: {
            get isInstalled() { return window.BOLD && BOLD.apps_installed; },
            get productOptions() { return this.isInstalled && BOLD.apps_installed['Product Options']; },
            get productUpsell() { return this.isInstalled && BOLD.apps_installed['Product Upsell']; },
        },
        recharge: {
            isSubscriptionProduct: function(cart) {
                return cart.items.some(function(item) {
                    return item.properties && (item.properties.subscription_id || item.properties.shipping_interval_frequency);
                });
            }
        }
    };


    // for future integartion
    this.boldUpsellCheckoutOffer = function() {
        if (!window.BOLD || !window.Shopify) return;

        var data  = {
            data: {
                cart: {
                  items: lqd.cart.items,
                  total_price: lqd.cart.total_price
                }
            }
        };

        return ajax.request({
            method: 'post',
            url: window.BOLD.upsell.path + window.Shopify.shop + '/validate_checkout_offer',
            data: JSON.stringify(data)
        });
    };

    this.needSkipClick = this.list.bold.productOptions || this.list.bold.productUpsell;

    this.start = function() {
        if (!lqd.upsell_cart_include_upsells) return;
        if (lqd.template_name !== 'cart') this.main();
        // try {
        //     this[(lqd.template_name === 'cart' ? 'cart' : 'main')]();
        // } catch (e) { console.warn(e); }
    };

    this.main = function() {
        var handleMutation = function(mutation) {
            if (
                mutation.type !== 'attributes'
                || mutation.target !== document.querySelector(self.ocuSelectors)
                || !/cart-?(popup|container|drawer)/i.test(mutation.target.id)
                || !/bold-upsell-modal-window/i.test(mutation.target.id)
            ) return;

            if (mutation.target.id === 'bold-upsell-modal-window') {
                return self.boldUpsellPopup(mutation.target);
            }

            var checkoutButtons = document.querySelectorAll(self.ocuSelectors);
            // var dataOcuCheckoutValue = checkoutButtons[0].dataset.ocuCheckout === 'true';
            var dataDisableRechargeValue = checkoutButtons[0].dataset.disableRecharge === 'true';
            var forEach = Array.prototype.forEach;

            forEach.call(checkoutButtons, function(item) {
                if (item.innerHTML === 'Checkout') item.removeAttribute('onclick'); // Integration with AceCase store
            });

            // if (!dataOcuCheckoutValue) { // Integration with MyDietChief store
            //     Array.prototype.forEach.call(checkoutButtons, function(item) {s
            //         item.dataset.ocuCheckout = true;
            //     });
            // }

            if (lqd.disabled_by_subscription_app && dataDisableRechargeValue) return;

            forEach.call(checkoutButtons, function(item) {
                item.disableRecharge = true;
            });

            self.cartPopup();
            self.cartDrawer(mutation.target);
            self.checkoutLinks();
            self.listenEvents();
        };

        var handleMutations = function(mutations) { mutations.forEach(handleMutation); };

        var config = {
            childList: true,
            subtree: true,
            attributes: true
        };

        new MutationObserver(handleMutations).observe(document, config);

        self.buyNowBtns();
        self.recharge.processCart();
        self.revy();
    };

    // this.cart = function() {
    //     // var handleMutation = function(mutation) {
    //     //     var target = document.querySelector(self.ocuSelectors);
    //     //     if (mutation.type === 'attributes' && mutation.target === target) {
    //     //         self.smar7();
    //     //     }
    //     // };

    //     // var handleMutations = function(mutations) { mutations.forEach(handleMutation); };

    //     // var config = {
    //     //     subtree: true,
    //     //     attributes: true
    //     // };

    //     // new MutationObserver(handleMutations).observe(document, config);

    //     self.revy();
    // };

    this.revy = function() {
        if (window.RevyApp && RevyApp.events) RevyApp.events.updatedCart = [];
    };

    this.discounts = Discounts;
    this.smar7 = smar7;
    this.isBoldRecuring = bold.isBoldRecuring;
    this.boldRecurring = bold.initRecurring;
    this.bold = bold;
    this.boldUpsellPopup = bold.upsellPopup;
    this.cartPopup = CartPopup;
    this.cartDrawer = CartDrawer;
    this.checkoutLinks = CheckoutLinks;
    this.handlePermalink = window.oneClickUpsellHandlePermalink = HandlePermalink.bind(this);
    this.buyNowBtns = BuyNowBtns;
    this.recharge = recharge;
    this.amazonPay = amazonPay;
    this.zipifyPages = zipifyPages;
    // this.amazonPay = function() { AmazonPay(self) };

    this.start();
}

function HistoryApi() {
    history.pushState = (function(f) {
        return function() {
            var result = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushState'));
            window.dispatchEvent(new Event('locationchange'));
            return result;
        };
    })(history.pushState);

    history.replaceState = (function(f) {
        return function() {
            var result = f.apply(this, arguments);
            window.dispatchEvent(new Event('replaceState'));
            window.dispatchEvent(new Event('locationchange'));
            return result;
        };
    })(history.replaceState);

    window.addEventListener('popstate', function() {
        window.dispatchEvent(new Event('locationchange'));
    });
}

// function Verify() {
//     var self = this;
//     var target;

//     this.init = function(target) {
//         target = target;

//         if (window.catchXHR) {
//             catchXHR = false;
//             XMLHttpRequest.callbacks = [];
//         }
//         if (window.beeketingWPJP) beeketingWPJP = {};

//         self.checkout()
//             .then(self.handle)
//             .catch(self.helpers.redirect);
//     };

//     this.data = function() {
//         var options = {
//             method: 'get',
//             url: self.helpers.getProxyUrl() + utils.store.get('lqdCart')
//         };

//         return ajax.request(options);
//     };

//     this.upsells = function(res) {
//         if (self.integrations.recharge.isSubscription(res)) {
//             var url = self.integrations.recharge.init(res, target);
//             utils.store.set('redirect_url', url);
//             res.data.redirect_url = url;

//             if (!lqd.integrate_with_recharge) {
//                 return new Promise(function(resolve) { resolve(res); });
//             }
//         }

//         res = self.cart.modify(res);

//         const cart = res.data;
//         return self._addToken(cart)
//             .then(function(c) {
//                 return self._makeCheckUpsells(c, res);
//             });
//     };

//     this.handle = function(res) {
//         // var isAppSkipCart = lqd.skip_cart && /index|collection|product/.test(lqd.template_name);
//         // var isThemeSkipCart = lqd.themeSkipCart;
//         // if (cart.redirect_url) return location = cart.redirect_url;
//         if (!res.status && !lqd.themeSkipCart) return self.helpers.redirect(res);
//         // if (!res.status && !lqd.themeSkipCart) return location.assign('/cart');

//         location = res.status || lqd.themeSkipCart
//             ? res.checkout_url
//             : '/cart';
//     };

//     this._makeCheckUpsells = function(cart, res) {
//         cart.items = self.helpers.filterCartItemFields(cart.items);

//         const data = {
//             shop_domain: lqd.current_domain,
//             cart: cart,
//             require_paypal: utils.store.get('requirePayPal'),
//             customer: { id: res.data.customer_id },
//             incarts: utils.store.get('incarts')
//             // incarts: { 47: { status: 'declined', shopify_variant_id: 16052480475207, quantity: 1, shown_at: Date.now() }}
//             // incarts: { 47: { status: 'offered', shopify_variant_id: 16052480475207, quantity: 1, shown_at: Date.now() }}
//         };

//         const options = {
//             method: 'post',
//             url: self.helpers.getProxyUrl() + utils.store.get('checkUpsells'),
//             data: utils.serialize(data, { indices: true })
//         };

//         return ajax.request(options);
//     };


//     this._addToken = function(cart) {
//         const store_token = utils.store.get('cart_token');
//         return new Promise(function(resolve, reject) {
//             if (!cart.token && store_token) {
//                 cart.token = store_token;
//                 resolve(cart);
//             } else if (!cart.token) {
//                 self.cart.get().then(function(res) {
//                     cart.token = res.data.token;
//                     resolve(cart);
//                 });
//             } else {
//                 resolve(cart);
//             }
//         });
//     }
// };

const appendChain = window.Symbol ? Symbol('appendChain') : 'oneClickUpsellAppendChain';
Object[appendChain]=function(t,o){for(var n=o,e=o2nd=oLast=t instanceof this?t:new t.constructor(t),r=this.getPrototypeOf(o2nd);r!==Object.prototype&&r!==Function.prototype;r=this.getPrototypeOf(o2nd))o2nd=r;return o.constructor===String&&(n=Function.prototype,e=Function.apply(null,Array.prototype.slice.call(arguments,1)),this.setPrototypeOf(e,oLast)),this.setPrototypeOf(o2nd,n),e};

function Updater(res) {
    this.res = res;
    this.isCartUpdated = utils.store.get('cartUpdated');
    this.isOfferDeclined = utils.store.get('offerDeclined');
    this.options = {
        add:    { method: 'post', url: '/cart/add.js' },
        change: { method: 'post', url: '/cart/change.js' },
        update: { method: 'post', url: '/cart/update.js' }
    };
    this.regs = {
        attributes: /\[(.+?)\]/,
        key: /(?:(?:updates|quantity)_(?:.*?))?(\d+:\w+)/,
        id: /(?:(?:updates|quantity)_(?:.*?))?(\d+):?/,
        noId: /(\d+(:\w+)?)$/
    };
    this.selectors = {
        form: 'form[action^="/checkout"], form[action^="/cart"]',
        attributes: '[name^="attributes["]',
        currency: '[name="currency"]',
        localization: 'form[action="/localization"]',
        geolocation_currency: 'input[name="currency_code"]',
        updates: '[name^="updates["], [data-cart-item-input-quantity], [data-cart-item-quantity], input[data-line], [name="quantity"], [data-quantity-input]',
        note: '[name="note"]',
        cartItemKey: '[data-cart-item-key], [data-cart-item], [data-variant]'
    };
    this.data = {
        currency: Shopify.currency.active !== lqd.shop_currency ? Shopify.currency.active : lqd.shop_currency,
        attributes: {},
        lineItems: [],
        updates: {},
        changes: [],
        sameIds: [],
        note: ''
    };
    this.payload = {
        updates: {},
        currency: '',
        note: null,
        attributes: {}
    };

    if (!window.klpixel /*integration with Klickly*/) this._restoreXMLHttp();
}
Updater.prototype = {
    init: function() {
        if (this.isCartUpdated && !this.isOfferDeclined) return this.resolve(this.res);
        if (!this.form) return this.updateCurrency();

        this.buildPayload();
        if (this.res) return this.updateCart();
    }
};
const UpdaterRequests = {
    updateCart: function(data, isUpgrade) {
        const options = this._getOptions('update', data, isUpgrade);
        const params = isUpgrade && data.changeData;
        const updateCart = function() { return ajax.request(options); };

        return this._updateSameId(params).then(updateCart);
    },
    addToCart: function(data) {
        const options = this._getOptions('add', data);

        return ajax.request(options);
    },
    changeCart: function(data, chain) {
        const options = this._getOptions('change', data);
        const request = !chain || chain instanceof Object
            ? ajax.request(options)
            : function() { return ajax.request(options); };

        return request;
    },
    updateCurrency: function() {
        if (!this.needCurrencyUpdate) return this.resolve(this.res);

        this.getCurrency();
        const options = this._getOptions('update', { currency: this.data.currency });

        return ajax.request(options).catch(this.resolve.bind(this, this.res));
    },
    _updateSameId: function(changeData) {
        if (!this.data.sameIds.length || !changeData) return this.resolve(false);

        const allRequests = this._getCartChangeRequests(changeData);
        const requestChain = this._requestChain(allRequests);

        return new Promise(requestChain.bind(this));
    },
    _getCartChangeRequests: function(changeData) {
        const cb = function(acc, change) {
            if (!change.id && !change.line) return acc;
            if (changeData) {
                const id = changeData.id;
                const line = changeData.__line || changeData.line;
                const isUpgradeItem = change.line === line || (id && change.id === id);
                if (isUpgradeItem) return acc;
            }

            delete change.__variantId;
            acc.push(this.changeCart(change, 'chain'));

            return acc;
        };

        return this.data.changes.reduce(cb.bind(this), []);
    },
    _requestChain: function(allRequests) {
        return function(resolve, reject) {
            if (!allRequests.length) return resolve(false);
            !function createRequest() {
                const req = allRequests.pop();
                const cb = function(res) {
                    if (allRequests.length) return createRequest();
                    resolve(res);
                };

                return req().then(cb).catch(reject);
            }();
        }
    },
    _getOptions: function(type, data, isUpgrade) {
        const options = Object.assign({}, this.options[type]);
        options.data = isUpgrade ? data.updateData : (data || this.payload);
        return options;
    }
};
const UpdaterPayload = {
    buildPayload: function() {
        this.getUpdates();
        this.getAttributes();
        this.getCurrency();
        this.getNote();

        Object.keys(this.payload).forEach(function(key) {
            this.payload[key] = this.data[key];
        }.bind(this));

        return this.payload;
    },
    getUpdates: function() {
        this.updateElements.forEach(function(item) {
            if (!item) return;
            // examples of item.id: '', 'quantity', '6565763', 'updates_456546:nn56d5j', '65765:2c9656mn'
            const isNoId = (
                !item.dataset.id &&
                !item.dataset.key &&
                !this.regs.noId.test(item.id) &&
                !this._getClosestKey(item)
            );
            const quantity = parseFloat(item.value);
            const line = this._getLine(item);
            if (isNoId) return this._saveLineItem(null, null, line, quantity);

            const key = this._getKey(item);
            const id = this._getId(item);
            const isIdMissing = id.toString().length < 3;

            this._saveLineItem(id, key, line, quantity);
            if (this.data.updates[id] || isIdMissing) this._saveSameId(id);
            this._saveChanges();
            if (~this.data.sameIds.indexOf(id) || isIdMissing) return;
            this._saveUpdates(id, quantity);
        }.bind(this));

        return this.data.updates;
    },
    getAttributes: function() {
        if (!this.attributesElements.length) return {};

        const cb = function(acc, item) {
            const attribute = this._getAttribute(item);
            if (!attribute.key) return acc;
            if (item.type === 'checkbox' && !item.checked) return acc;

            acc[attribute.key] = attribute.value;
            return acc;
        };

        this.data.attributes = this.attributesElements.reduce(cb.bind(this), {});
        return this.data.attributes;
    },
    getCurrency: function() {
        if (!this.currencyElement) return this.data.currency;
        this.data.currency = this.currencyElement.value;
        return this.data.currency;
    },
    getNote: function() {
        if (!this.noteElement) return '';
        this.data.note = this.noteElement.value;
        return this.data.note;
    }
};
const UpdaterPrecheckout = {
    acceptAddOffer: function(data) {
        return this.updateCart().then(this.addToCart.bind(this, data));
    },
    acceptUpgradeOffer: function(addData, cartItem, cartItemLine) {
        const data = this._getUpgradeOfferData(cartItem, cartItemLine);
        const changeData = Object.assign({}, data.changeData);
        delete changeData.__line;

        return this.updateCart(data, 'upgrade')
            .then(() => OCUIncart._is_product_action
            ? this.addToCart(addData)
            : this.changeCart(changeData).then(this.addToCart.bind(this, addData)));
    },
    _getUpgradeOfferData: function(cartItem, cartItemLine) {
        const udpateData = Object.assign({}, this.payload);
        const lineItemByKey = this.data.lineItems.find(function(item) {
            return item.id === cartItem.key;
        });
        const lineItemById = this.data.lineItems.find(function(item) {
            return item.__variantId === cartItem.id;
        });
        const lineItemByLine = this.data.lineItems.find(function(item) {
            return item.line === cartItemLine;
        });
        const lineItem = lineItemByKey || lineItemById || lineItemByLine;
        const quantity = lineItem.quantity ? lineItem.quantity - 1 : 0;
        const changeData = {
            // __line: cartItemLine,
            // id: cartItem.key,
            line: cartItemLine,
            quantity: quantity
        };

        delete udpateData.updates[cartItem.id];

        return {
            updateData: udpateData,
            changeData: changeData
        };
    }
};
const UpdaterElements = {
    get forms() {
        const forms = document.querySelectorAll(this.selectors.form);
        const visibleForms = this.arrayFrom(forms).filter(function(form) {
            return form.offsetHeight || this._isVisible(form);
        }.bind(this));

        return visibleForms;
    },
    get form() {
        const isNotePresent = this.forms.some(function(e) {
            return e.note && e.note.value;
        });
        const isValidAction = function(form) {
            return !/add|change|update/.test(form.action);
        }
        const isValidForm = function(form) {
            const parentCondition = !!form.closest('.cv_outer_cart_drawer');
            const inputCondition = !!form.querySelector('[id="pro_quantity"]');

            return parentCondition && inputCondition
        }
        const filteredForm = this.forms.find(function(form) {
            return (
                isValidAction(form) &&
                form.querySelector(this.selectors.updates) &&
                (isNotePresent ? form.note && form.note.value : true) &&
                !isValidForm(form)
            );
        }.bind(this));

        return filteredForm;
    },
    get updateElements() {
        const arr = this.arrayFrom(this.form.querySelectorAll(this.selectors.updates));

        return arr
            .filter(function(item) {
                return item && !item.disabled && !item.dataset.removedItemRow;
            })
            .map(function(item) {
                const child = item.querySelector('input');
                return child ? child : item;
            });
    },
    get attributesElements() {
        const nodeList = this.form.querySelectorAll(this.selectors.attributes);
        return this.arrayFrom(nodeList);
    },
    get noteElement() {
        return this.form.querySelector(this.selectors.note);
    },
    get currencyElement() {
        return document.querySelector(this.selectors.currency) || this._geolocationElement;
    },
    get _geolocationElement() {
        const geoElements = document.querySelectorAll(this.selectors.localization);
        const visibleLocalizationForm = this.arrayFrom(geoElements).find(e => e.offsetHeight || this._isVisible(e));
        return visibleLocalizationForm && visibleLocalizationForm.querySelector(this.selectors.geolocation_currency);
    }
};
const UpdaterHelpers = {
    resolve: function(res) {
        return new Promise(function(resolve) { resolve(res); });
    },
    arrayFrom: function(nodeList) {
        if (!(nodeList instanceof NodeList)) nodeList = [nodeList];
        return Array.prototype.slice.call(nodeList);
    },
    _getLine: function(item) {
        return +(
            item.dataset.quantityItem ||
            item.dataset.lineId ||
            item.dataset.line ||
            item.closest('[data-line]') && item.closest('[data-line]').dataset.line);
    },
    _getKey: function(item) {
        if (this._isDawnTheme()) return this._getThemeKey(item);
        const match = this.regs.key.exec(
            item.dataset.id ||
            item.dataset.key ||
            item.id ||
            this._getClosestKey(item)
        );
        return match && match[1].split('_')[0];
    },
    _getId: function(item) {
        if (this._isDawnTheme()) return this._getThemeId(item);
        const match = this.regs.id.exec(
            item.dataset.variant ||
            item.dataset.id ||
            item.dataset.key ||
            item.id ||
            this._getClosestKey(item)
        );
        return match && +match[1];
    },
    _saveSameId: function(id) {
        delete this.data.updates[id];
        this.data.sameIds.push(id);
    },
    _saveLineItem: function(id, key, line, quantity) {
        const lineItem = {
            __variantId: id,
            quantity: quantity,
        };

        if (line) lineItem.line = line;
        else if (key) lineItem.id = key;

        this.data.lineItems.push(lineItem);
    },
    _saveChanges: function() {
        this.data.changes = this.data.lineItems.filter(function(item) {
            return ~this.data.sameIds.indexOf(item.__variantId);
        }.bind(this));
    },
    _saveUpdates: function(id, quantity) {
        this.data.updates[id] = quantity;
    },
    _getAttribute: function(item) {
        const match = this.regs.attributes.exec(item.name);
        if (!match) return {};
        return { key: match[1], value: item.value };
    },
    _isVisible: function(el) {
        const styles = window.getComputedStyle(el);
        return styles.display === 'block' && styles.visibility === 'visible';
    },
    get needCurrencyUpdate() {
        return this.currencyElement && this.currencyElement.value !== this.data.currency;
    },
    _isDawnTheme: function() {
        return /^Dawn(\s*?\|?|$)/.test(window.Shopify.theme.name);
      },
    _getThemeKey: function(item) {
        const link = item.closest('[id^="CartItem"]').querySelector('[id^="Remove"] a').href;
        const match = this.regs.key.exec(link);
        return match && match[1].split('_')[0];
      },
    _getThemeId: function(item) {
        const selectors = [
            { selector: '[id^="Remove"] a', regexp: /id=(\d+)/ },
            { selector: 'a[href*=\'variant=\']', regexp: /variant=(\d+)/ }
        ];
        return selectors.reduce((acc, element) => {
            if (acc) return acc;

            const link = item
                .closest('[id^="CartItem"]')
                .querySelector(element.selector);
            const match = link && link.href.match(element.regexp);

            return match && +match[1];
        }, null) || [];
      },
    _getClosestKey: function(item) {
        const closestKey = item.closest(this.selectors.cartItemKey);
        if (!closestKey) return;
        const cartItemKeys = ['cartItemKey', 'cartItem', 'variant'];
        return closestKey.dataset[Object.keys(closestKey.dataset).find(function(key) {
            return cartItemKeys.includes(key)
        })];
    },
    _restoreXMLHttp: function() {
        try {
            XMLHttpRequest.prototype.open = openReplacement;
            XMLHttpRequest.prototype.send = originSend;
        } catch (error) {
            console.log(error);
        }
    }
};

[UpdaterRequests, UpdaterPayload, UpdaterPrecheckout, UpdaterElements, UpdaterHelpers]
.forEach(function(module) {
    Updater.prototype = Object[appendChain](Updater.prototype, module);
});

function Cart() {
    var self = this;

    this.add = function(form, button, data) {
        if (form) {
            var noId = function(serialized) { return !/id/.test(serialized); };

            data = self.serialize(form);

            if (noId(data)) {
                const customForm = document.querySelector('#AddToCartForm');
                if (customForm )data = self.serialize(customForm);
            }

            if (noId(data)) {
                var idOnBtn = document.querySelector('[data-cart-add]');
                if (idOnBtn) data = 'id=' + idOnBtn.dataset.cartAdd;
            }
        }

        var options = {
            method: 'post',
            url: '/cart/add.js',
            data: data
        };

        return ajax.request(options);
    };

    this.bulkAdd = function(data) {
        var options = {
            method: 'post',
            url: '/cart/update.js',
            data: data
        };

        return ajax.request(options)
    };

    this.get = function(query) {
        const validateQuery = typeof query === 'string' ? query : '';

        var options = {
            method: 'get',
            url: '/cart.js' + validateQuery
        };

        return ajax.request(options);
    };

    this.update = function(res) {
        return new Updater(res).init();
    };

    this.save = function(res) {
        // if (self.needCurrencyUpdate()) self.updateCurrency();
        self.disableMultiUpdate(res.data.cart.items);
        self.saveTags(res);

        // if (!lqd.is_precheckout && lqd.is_ajax_precheckout && !utils.cookie.get('ocu_countdown_start')) {
        //     return window.OCUPrecheckout({ utils: utils });
        // }

        lqd.cart_products_json = res.data.cart_products;
        lqd.cart_collections_json = res.data.cart_collections;
        lqd.subscription_products_json = res.data.subscription_products;
        lqd.subscription_variants_json = res.data.subscription_variants;

        return self.resolve(res);
    };

    this.modify = function(res) {
        const cart = res.cart || res.data.cart || res.data;

        // res.data = self.helpers.filterFields(cart);
        res.data = cart;
        res.data.subscription_products = lqd.subscription_products_json;
        res.data.cart_collections = lqd.cart_collections_json;
        res.data.cart_products = lqd.cart_products_json.filter(function(item) { return !item.error; });
        res.data.customer_id = lqd.customer_id;
        res = self.helpers.addBuyXGetYDiscount(res);
        if (cart.cart_level_discount_applications) res.data.automatic_discount = cart.cart_level_discount_applications[0];

        return res;
    };

    this.serialize = function(form) {
        return /trident|edge/i.test(navigator.userAgent)
            ? utils.serializeFormEdge(form)
            : utils.serializeForm(form);
    };

    this.attrubutes = function(attr) {
        const options = {
            method: 'post',
            url: '/cart/update.js',
            data: { attributes: attr }
        };

        ajax.request(options);
    };

    this.prepareUpdate = function(items) {
        var handle = function(acc, item) {
            var id = item.id.replace(/(\w+_)(\d+)(:\w+)/, '$2');
            acc[id] = item.value;

            return acc;
        };

        items = items.length ? items : [items];

        var updates = Array.prototype.reduce.call(items, handle, {});

        return {
            updates: updates,
            currency: lqd.shop_currency
         };
    };

    this.saveTags = function(res) {
        var tags = res.data.cart_products.reduce(function(acc, product) {
            return acc.concat(product.tags);
        }, []);

        utils.store.set('tags', tags);
    };

    this.disableMultiUpdate = function(lineItems) {
        const inputs = document.querySelectorAll('input[name="updates[]"]');
        const offer = utils.store.get('offer');
        const isAdd = offer === 'add';

        if (isAdd && lineItems.length === inputs.length + 1) return;
        if (!isAdd && lineItems.length === inputs.length) return;

        Array.prototype.forEach.call(inputs, function(input) {
            if (!input.offsetHeight) input.disabled = true;
        });
    };

    this.state = function(e) {
        if (e.target.name !== 'updates[]') return;
        utils.store.set('cartChanged', true);
    };

    this.resolve = function(res) {
        return new Promise(function(resolve) { resolve(res); });
    };

    this.needCurrencyUpdate = function() {
        return document.querySelector('[name="currency"]');
    };

    this.updateCurrency = function() {
        var options = {
            method: 'post',
            url: '/cart/update.js',
            data: { currency: lqd.shop_currency }
        };

        ajax.request(options).then(function() { utils.store.set('cartChanged', false); });
    };

    this.isNotePresent = function(forms) {
        return Array.prototype.some.call(forms, function(e) { return e.note && e.note.value });
    };

    this.filterFormsIfNotes = function(forms, isNotePresent) {
        var handle = function(form) {
            return form['updates[]'] && (isNotePresent ? form.note && form.note.value : true);
        };

        return Array.prototype.filter.call(forms, handle)[0];
    };

    this.error = function(e) {
        var desc = e.data.description;

        if (e.status !== 422) return alert(desc || 'Something went wrong. Please try again.');

        var allInCart = /all/i.test(desc);
        var soldOut = /sold out/i.test(desc);

        alert(desc);

        if (allInCart) return self.checkout({ redirect: true });
        if (soldOut) location.reload();
    };
};

var SyncQtyFields = {
    init: function() {
        // if (!lqd.upsell_cart_include_upsells) return;
        if (!this.fields.length) return;
        this.listenEvents();
    },
    get fields() {
        return document.querySelectorAll('[data-quantity-item]');
    },
    getFiledsForUpdate: function(target) {
        var id = this.getId(target);
        var elems = document.querySelectorAll('[data-quantity-item="' + id + '"]');
        var arr = this.getArray(elems);

        return arr;
    },
    getId: function(target) {
        return target.dataset.quantityItem;
    },
    getArray: function(nodeList) {
        return Array.prototype.slice.call(nodeList);
    },
    update: function(target, value) {
        this.getFiledsForUpdate(target).forEach(function(field) {
            field.value = value;
        });
    },
    handle: function(e) {
        this.update(e.target, e.target.value);
    },
    listenEvents: function(e) {
        this.getArray(this.fields).forEach(function(field) {
            field.addEventListener('input', this.handle.bind(this));
        }.bind(this));
    }
}.init();

function SkipCart() {
    var self = this;

    // if (lqd.themePopup && lqd.isThemePopupTag) return;

    this.init = function() {
        const isSkipCartPage = /index|collection|product/.test(lqd.template_name);
        lqd.skip_cart && isSkipCartPage && setTimeout(self.prepare);
    };

    this.prepare = function() {
        // TODO: move selectors to store
        const forEach = Array.prototype.forEach;
        const getArr = function(nodeList) { return Array.prototype.slice.call(nodeList); };
        const fakeForms = getArr(document.querySelectorAll('.product-form__cart'));
        let forms = getArr(document.querySelectorAll('form[action*="cart"], [data-zp-add-to-cart-form], #AddToCartForm1'));
        forms = forms.filter(function(form) { return form.dataset.zpLinkType !== 'zipify_page'; });

        if (fakeForms.length) forms = forms.concat(fakeForms);

        forms.forEach(function(form) {
            const buttons = getArr(form.querySelectorAll('*[type="submit"], input[type="button"], button'));

            buttons.forEach(function(button) {
                if (button.dataset.qty || button.dataset.quantityAction) return;
                if (button.dataset.pfType && button.dataset.pfType !== 'ProductATC') return;
                if (button.getAttribute('aria-controls')) return;
                if (/plus|minus|zpa-quantity/.test(button.className)) return;
                if (/error_txt|quantity|sold-out/i.test(button.id)) return;
                if (/amount|review/i.test(button.value)) return;

                button.removeAttribute('onclick');
                button.dataset.skipCart = true;
                button.type = 'button';
            });
        });

        self.listenEvents(forms);
    };

    this.handle = function(e) {
        const zpIntegration = self.handleZPEvent(e);
        if (zpIntegration) return;

        if (!self.popupDispatcher.target) self.popupDispatcher.target = e.target;
        if (self.popupDispatcher.isProductAction && !self.popupDispatcher.secondAttempt) return;
        let button = e.target.dataset.skipCart ? e.target : null;
        if (!button) button = e.target.closest('[data-skip-cart]');
        if (!button) return;

        button.disabled = true;

        e.stopImmediatePropagation();
        e.stopPropagation();
        e.preventDefault();

        let form = button.closest('form');
        if (!form) form = document.querySelector('form[action="/cart/add"]');

        self.cart.add(form, button)
            .then(self.cart.get)
            .then(self.onSuccess)
            .catch(self.onError.bind(null, form));
    };

    this.onSuccess = function(res) {
        utils.store.set('cart_token', res.data.token);
        if (self.helpers.isSubscriptionProductInCart(res.data)) return location = '/cart';
        self.checkout({ redirect: true });
    };

    this.onError = function(form) {
        form.submit();
    };

    this.listenEvents = function(forms) {
        document.addEventListener('click', self.handle, true);
    };

    this.handleZPEvent = e => {
        const getZPType = el => el.dataset.zpAddToCart !== undefined;
        const target = e.target;
        const button = getZPType(target) ? target : target.closest('[data-zp-add-to-cart]');

        if ((button && e.isTrusted) && getZPType(button)) {
            button.type = 'submit';
            button.click();
            return true;
        }
        return false;
  }

    this.init();
}

function BuyNow(e) {
    const self = this;

    if (lqd.themePopup && lqd.isThemePopupTag) return;
    if (!e.isTrusted) return;

    const form = e.target.closest('form[action="/cart/add"]') || document.querySelector('form[action="/cart/add"]');
    if (!form) return;

    e.stopImmediatePropagation();
    e.preventDefault();
    e.target.disabled = true;

    const cb = function() { self.checkout({ redirect: true }) };
    const onError = function(form) { form.submit() };

    self.cart.add(form, e.target).then(cb).catch(onError.bind(null, form));
}


function PublicMethod() {
    const self = this;
    const proto = self.__proto__.__proto__;
    const integrations = OCUIncart.integrations();

    this.init = function() {
        window.oneClickUpsellGetCheckoutUrl = proto.checkout = self.create;
        proto.verify = self._verify.bind(this);
    };

    this.create = function(config) {
        if (config === 'skip_cart') {
            return new Promise(function(resolve) { resolve(lqd.skip_cart); });
        }

        const hasCookie = utils.cookie.get('ocu_progress_bar') && utils.cookie.get('ocu_progress_bar').length;
        const hasUpsellsInCart = !OCUIncart.hasOfferInCart && hasCookie;
        const headerType = utils.cookie.get('ocu_header');
        if ((hasUpsellsInCart || config.redirect_url) && !headerType) return self._checkout(config);

        return self._verify()
            .then(function(response) {
                self._checkout(Object.assign(config, {
                    redirect_url: response.data.redirect_url || lqd.checkoutUrl
                }));
            })
            .catch(function() { self._checkout(config); });

    };

    this.prepare = function(config) {
        const params = utils.store.get('params');
        self.config = config || {};
        self.config.incarts && utils.store.set('incarts', self.config.incarts);
        self.config.path && utils.store.set('amazonPath', self.config.path);
        self.config.button && self.helpers.payPal(self.config.button);
        self.integrations.discounts();
        self.params();
        self.handleDeclineOffer(config);

        if (integrations.tidio.present) integrations.tidio.track();

        params.str = params.str ? '?' + params.str : '';
        self.config.checkoutUrl = (self.config.redirect_url || lqd.checkoutUrl) + params.str;

        utils.store.set('params', params);
    };

    this.redirect = function(result) {
        const recharge = self.integrations.recharge;
        const bundlerBuilder = integrations.bundlerBuilder;
        if (bundlerBuilder.present) return bundlerBuilder.submit();
        if (recharge.isSubscription(lqd)) return recharge.redirect(null, null, result.checkout_url);
        if (result.destination === 'checkout' || lqd.skip_cart) return location.assign(result.checkout_url);
        location.assign('/' + result.destination);
    }

    this._checkout = function(config) {
        self.prepare(config);

        const result = {
            status: false,
            checkout_url: self.config.checkoutUrl,
            skip_cart: lqd.skip_cart,
            get redirect_url() {
                return this.checkout_url;
            },
            destination: proto.popupDispatcher.destination
        };


        if (self.config.redirect) return this.redirect(result);
        return new Promise(function(resolve) { resolve(result) });
    }

    this._verify = function() {
        const url = '/pre_purchase/v1/draft_orders/verify';
        const endpoint = window.OCUIncart && OCUIncart.appEndpoint;
        const headers = {
            'Content-Type': 'application/json',
            'Shop-Domain': lqd.permanent_domain
        };
        return axios.post(endpoint + url, this._verifyPayload(), { headers: headers });
    }

    this._verifyPayload = function() {
        const cartToken = utils.cookie.get('cart');
        let items = self.helpers.getCartItems(OCUIncart.cart_items);
        items = self.integrations.zipifyPages.appendZipifyPagesProduct(items.line_items);
        const payload = { checkout: { line_items: items } };
        const threshold = +utils.cookie.get('ocu_progress_bar');
        const header = OCUIncart.header_type || utils.cookie.get('ocu_header');

        payload.checkout = Object.assign(payload.checkout, {
            cart_token: cartToken,
            verify_draft_order: true,
            note: lqd.cart.note,
            attributes: lqd.cart.attributes,
            currency_rate: (window.Shopify && Shopify.currency && +Shopify.currency.rate) || 1,
            threshold: threshold,
            header_type: header
        });

        return payload;
    }

    this.params = function() {
        const params = utils.store.get('params');
        const zapiet = integrations.zapiet;
        const simpleInStorePickup = integrations.simpleInStorePickup;
        const weglot = integrations.weglot;

        if (zapiet.present) self.config.params = zapiet.merge(self.config.params);
        if (simpleInStorePickup.present) self.config.params = simpleInStorePickup.merge(self.config.params);
        if (weglot.present) self.config.params = weglot.merge(self.config.params);

        (self.config.params || [])
            .concat(self.gaLinker())
            .concat({t: +Date.now()})
            .map(function(param) {
                return Object.keys(param).map(function(key) {
                    const value = key === 'discount' || zapiet.present
                        ? param[key]
                        : encodeURIComponent(param[key]);

                    return {
                        name: encodeURIComponent(key),
                        value: value
                    };
                })[0];
            })
            .forEach(function(param) {
                params.arr.push(param);
            });

        utils.store.set('params', params);
        self.helpers.params();
    };

    this.handleDeclineOffer = function(config) {
        if (!config || config && !config.incarts) return;

        const isDeclined = Object.keys(config.incarts).some(function(key) {
            return config.incarts[key].status === 'declined';
        });

        utils.store.set('offerDeclined', isDeclined);
    };

    this.gaLinker = function() {
        try {
            const linkerParam = ga.getAll()[0].get('linkerParam');
            const keyValue = linkerParam.split('=');
            const param = {};
            return ((param[keyValue[0]] = keyValue[1]), [param]);
        } catch (e) {
            return [];
        }
    };

    this.init();
}

function Helpers() {
    var self = this;

    this.disableButtons = function() {
        utils.store.set('checkoutButtonState', false);
    };

    this.params = function() {
        var params = utils.store.get('params');

        for (var i = 0; params.arr.length > i; i++) {
            var reg = new RegExp(params.arr[i].name);
            if (reg.test(params.str)) continue;

            params.str += params.arr[i].name + '=' + params.arr[i].value;
            if (i + 1 !== params.arr.length) params.str += '&';
        }

        utils.store.set('params', params);
    };

    this.redirect = function(res) {
        if (res.redirect_url) return location.assign(res.redirect_url);
        if (!lqd.subscription_products_size) return location.assign(res.checkout_url);

        const form = document.querySelector('form[action="/checkout"], form[action="/cart"]');
        if (!form) return self.checkout({ redirect: true });

        form.submit();
    };

    this.simulateSubmit = function() {
        var checkoutButtons = document.querySelectorAll(self.ocuSelectors);
        if (!checkoutButtons.length) return location = '/cart';

        var last = Array.prototype.slice.call(checkoutButtons, -1)[0];
        last.dispatchEvent(new MouseEvent('click'));
    };

    this.simulateDocumentClick = function() {
        var event = new Event('click');
        var target = document.createElement('button');

        target.type = 'submit';
        target.name = 'checkout';
        Object.defineProperty(event, 'target', { value: target });

        document.dispatchEvent(event);
    };

    this.preventMouseDown = function(e) {
        e.preventDefault();
        e.stopPropagation();
        // e.stopImmediatePropagation();
    };

    this.payPal = function(el) {
        if (el.name !== 'goto_pp' || el.value !== 'paypal_express') return;

        var params = utils.store.get('params');

        params.arr.push({
            name: el.name,
            value: el.value
        });

        utils.store.set('requirePayPal', true);
        utils.store.set('params', params);
    };

    this.filterFields = function(cart) {
        var needed_cart_fileds = utils.store.get('neededCartFileds');
        var needed_cart_items_fields = utils.store.get('neededCartItemsFields');

        cart = utils.filterObject(cart, needed_cart_fileds);

        cart.items = cart.items.map(function(item) {
            return utils.filterObject(item, needed_cart_items_fields);
        });

        return cart;
    };

    this.filterCartItemFields = function(items) {
        return items.map(function(item) {
            return Object.keys(item).reduce(function(acc, key) {
                if (key === 'product_description') return acc;
                acc[key] = item[key];
                return acc;
            }, {});
        });
    };

    this.checkSelector = function(target) {
        if (target.dataset.ocuCheckout === 'true') return target;

        const checkoutButtons = document.querySelectorAll(self.ocuSelectors);
        const isInclude = Array.prototype.some.call(checkoutButtons, function(item) {
            return item === target;
        });

        const isCartContentParent = target.closest('.cart_content') && target.closest('form[action="/checkout"] [type="submit"]');
        const isCartTemplate = lqd.template_name === 'cart' && target.closest('form[action="/cart"] [type="submit"]');
        const isCartAction = target.closest(self.ocuSelectors) || isCartContentParent || isCartTemplate;
        const notIncartUpsell = !target.closest('.nudge-offer'); // check if triggered Incart Upsell widget triggered

        const addToCartButton = (lqd.template_name === 'product' && !target.closest('form[action$="/cart/add"]'))
            && (((target.name === 'add' && target.type === 'submit') ? target : null)
            || (target.closest('[name="add"]')) && target.closest('[type="submit"]'));

        const parent = !isInclude
            && (isCartAction || target.closest('[name="checkout"]'))
            || addToCartButton;

        if ((isInclude || parent) && notIncartUpsell) return isInclude ? target : parent;
    };

    this.checkDirectCheckoutButtons = function(target) {
        return /\/checkout/.test(target.onclick && target.onclick.toString())
    };

    this.checkAddToCart = function(target) {
        const isTargetSubmit = /submit|add|checkout/.test(target.name) || this.isActionButton(target);
        return (isTargetSubmit || this.isBuyNow({target: target})) && target.closest('form[action*="/cart/add"]'); // , form[data-zp-add-to-cart-form] - Pages selector
    };

    this.zpPreventRedirect = function(target) {
        const condition = target.dataset.type === 'crm_dest'
            || target.dataset.zpProductRedirectLink === ''
            || target.dataset.zpAddToCart === '' // pages product page and ocu product location integration
            || target.closest('[data-type="crm_dest"]')
            || target.closest('[data-zp-product-redirect-link]')
            || target.closest('[data-zp-add-to-cart]');

        if (condition) return true;
    };

    this.isOfferProduct = function() {
        return lqd.cart_variants_json.some(function(item) {
            return item.properties && item.properties._ocu_offer_id;
        });
    };

    this.addBuyXGetYDiscount = function(res) {
        var discounts = res.data.items.reduce(function(acc, variant) {
            if (!variant.discounts[0]) return acc;
            let item = {
                item_key: variant.key,
                discount: variant.discounts,
            };
            if (variant.line_level_discount_allocations[0]) item.discount_data = variant.line_level_discount_allocations;
            acc.push(item);
            return acc;
        }, []);

        if (discounts.length) res.data.per_item_discounts = discounts;
        return res;
    };

    this.isActionButton = function(e) {
        const submitSelectors = ['[type="submit"]', '[name="add"]', '[name="checkout"]'];
        return submitSelectors.reduce(function(acc,select) {
            const el = e.closest(select);
            if (el) acc = true;
            return acc;
        }, false);
    };

    this.isBuyNow = function(e) {
        if (!e) return false;
        const selectors = utils.store.get('classList');
        return e.target.classList.contains(selectors.buyNow) && !e.target.classList.contains(selectors.buyNowBranded);
    };

    this.getCartItems = function(items) {
        const itemProperties = [
            'key',
            'properties',
            'quantity',
            'variant_id',
            'product_id',
            'price',
            'original_price',
            'discounted_price',
            'line_price',
            'original_line_price',
            'final_price',
            'final_line_price',
            'key'
        ];

        const prepareItem = function(item) {
            return itemProperties.reduce(function(acc, prop) {
                acc[prop] = item[prop] || item[prop] === 0 ? item[prop] : {};
                return acc;
            }, {});
        };

        return { line_items: items.map(prepareItem) };
    };

    this.isSameCart = function(cart) {
        const lastCart = utils.cookie.get('ocu_cart_items');
        const newCartItemsKeys = cart.items.map(item => item.key);
        utils.cookie.set('ocu_cart_items', JSON.stringify(newCartItemsKeys));

        if (!lastCart) return false;

        const newCartSet = new Set(newCartItemsKeys);
        const lastCartSet = new Set(JSON.parse(lastCart));

        return this.areSetsEqual(newCartSet, lastCartSet);
    };

    this.isSameCartToken = function(cart) {
        return cart.token === utils.cookie.get('ocu_popup_token');
    };

    this.areSetsEqual = function(setA, setB) {
        return setA.size === setB.size && Array.from(setA).every(value => setB.has(value));
    };

    this.isSubscriptionProductInCart =  function(cart) {
        return cart.items.reduce(this.isSubscriptionItem, null);
    };

    this.isSubscriptionItem = function(acc, item) {
        const properties = utils.store.get('subscriptionProperties');
        let result = acc;
        Object.entries(properties).some(function(prop) {
            const somePropMatch = prop[1].some(function(field) {
                return item.properties && item.properties[field];
            });

            if (somePropMatch && !item.selling_plan_allocation) {
                result = prop[0];
                return result
            }

            return result;
        });

        return result;
    };

    this.showCheckoutButton = function() {
        const config = utils.store.get('checkoutButton');
        const checkoutBtn = document.querySelector(config.selector);
        const exemptify = OCUIncart.integrations().exemptify;

        if (!checkoutBtn || exemptify.present) return;

        const isValidButton = Object.entries(config.excludes).every(function(item) {
            return !item[1].test(checkoutBtn[item[0]]);
        });

        if (isValidButton && checkoutBtn.style.display === 'none') checkoutBtn.style.display = 'inline-block';
    };

    this.clearFallback = function() {
        const fallbackTimeout = utils.store.get('fallback').id;
        clearTimeout(fallbackTimeout);
    };

    this.beforeCreate = function() {
        if (utils.store.get('salesRocketIntegrationApplied')) {
            const cartDrawerSalesRocketControl = document.querySelector(utils.store.get('cartDrawerSalesRocketControl').selector);
            if (cartDrawerSalesRocketControl) cartDrawerSalesRocketControl.click();
        }

        const cartDrawerTimberControl = document.querySelector(utils.store.get('cartDrawerTimberControl').selector);
        if (cartDrawerTimberControl) cartDrawerTimberControl.click();

        const cartDrawerControl = document.querySelector(utils.store.get('cartDrawerControl').selector);
        if (cartDrawerControl) cartDrawerControl.click();

        const chatButton = document.querySelector(utils.store.get('chatButton').selector);
        if (chatButton) chatButton.remove();
    };

    this.isDisabledButton = function(target) {
        const button = target.closest('button');
        const entity = target.tagName.toLowerCase() === 'button' ? target : button;
        return entity && (entity.disabled || !!entity.ariaDisabled);
    };

    this.termsOfServiceConfirmation = function(target) {
        const form = target.closest('form[action="/checkout"], form[action="/cart"]');
        const termsCheckbox = form && form.querySelector(utils.store.get('termsOfServiceCheckbox').selector);
        return termsCheckbox && !termsCheckbox.checked;
    };

    this.isCartPopupRedirectsToCart = function(e) {
        if (!e.target.dataset.ocuCheckout) return;
        if (lqd.template_name === 'cart') return;

        // handle outofthesandbox themes
        return Shopify.theme_settings && Shopify.theme_settings.go_to_checkout === false;
    };

    this.removeExtraClassList = function(elem) {
        if (!elem) return;

        const classList = utils.store.get('extraClassListToRemove').join(',');

        elem.classList.remove(classList);
    };
}

function ApplicationsUtils() {

    const Z_INDEX_VALUE = 1000;

    const Z_INDEX_ELEMENTS = {
        overlay: '.slidecarthq-overlay',
        cartDrawer: '[cart-drawer-show], .slidecarthq, #sidebar-cart',
        chatWindow: '#chat-window',
        chatButton: '#chat-button'
    };

    this.beforePrecheckoutPopup = function() {
        this.adjustZIndex();
        this.hideSlidecart();
    }

    this.adjustZIndex = function() {
        Object
            .values(Z_INDEX_ELEMENTS)
            .forEach(function(selector) {
                const element = document.querySelector(selector);
                if (element) element.style.zIndex = Z_INDEX_VALUE;
            });
    },

    this.hideSlidecart = function() {
        if (this.isMobile()) {
            if (window.SLIDECART_CLOSE) SLIDECART_CLOSE();
        }
    }

    this.isMobile = function() {
        return /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Mobile|Opera Mini/i.test(navigator.userAgent);
    }
}

[Helpers, Integrations, Cart, PublicMethod, SkipCart, BuyNow].forEach(function(item) {
    Object.setPrototypeOf(item.prototype, Application.prototype);
});

const script = document.createElement('script');
document.head.appendChild(script);
script.src = ocuCdn + '/vendor/axios.min.js';

function initApplication() {
    const application = new Application();
    OCUApi.initialize({ context: application });
    return application;
}

script.onload = function() {
    if (window.axios) return initApplication()
    if (window.require) {
        require([ocuCdn + '/vendor/axios.min.js'], function(e) {
            window.axios = e;
            initApplication()
        });
    }
};

function requireOptionSelectors() {
    if (window.Shopify && Shopify.OptionSelectors) return;

    const s = document.createElement('script');
    document.head.appendChild(s);
    s.src = OCUIncart.option_selection;
    s.onload = function() {
        window.Shopify = window.Shopify || {};
        Shopify.money_format = OCUIncart.money_format;
    };
}

function Store() {
    var _private = {
        store: {
            ocuSelectors: '[name="checkout"], [href^="/checkout"], form[action^="/checkout"] [type="submit"], form[action$="/cart"] [type="submit"], #checkout, [name="goto_pp"], .checkout_button, .checkout-button, [value="Checkout"], .cart-button-checkout, #btn-checkout, .btn__checkout.js-prefill-url, form[action^="/checkout"] .chk_out, form[action^="/cart"] .chk_out, form[action^="/cart"] .cart__checkout, form[action^="/cart"] .ajaxcart__checkout.ajax-cart__button, form[action^="/cart"] .btn-checkout, #rebuy-cart .rebuy-cart__flyout-footer .rebuy-button, #slidedown-cart .actions .btn.btn-checkout',
            addToCartButton: '[name="add"]',
            proxy: '/apps/secure-checkout',
            lqdCart: '/upsellapp_cart',
            checkUpsells: '/check_upsells',
            excludedRequiredFormIds: ['cbb-shipping-rates-calculator-form'],
            neededCartFileds: ['token','note','attributes','items', 'currency', 'cart_level_discount_applications'],
            neededCartItemsFields: ['product_id','variant_id','quantity','grams','price','line_price','title','properties','vendor','sku','key'],
            permalink: /cart\/(\d+:\d+(?:,\d+:\d+)*)(?:[?&]discount=([-\w! %205]+))*/,
            subscriptionProperties: {
                recharge: ['subscription_id', 'shipping_interval_frequency', 'shipping_interval_unit_type'],
                bold: ['frequency_num', 'frequency_type']
            },
            isAddToCartClicked: false,
            cartChanged: false,
            cartUpdated: false,
            requirePayPal: false,
            checkoutButtonState: false,
            submitted: false,
            amazonPayInitiated: false,
            salesRocketIntegrationApplied: false,
            redirect_url: null,
            offer: null,
            offerDeclined: false,
            incarts: {},
            tags: [],
            isPermalinkHandling: false,
            isTargetBuyNow: false,
            cart_token: null,
            classList: {
                buyNow: 'shopify-payment-button__button',
                buyNowBranded: 'shopify-payment-button__button--branded'
            },
            params: {
                str: '',
                arr: []
            },
            fallback: {
                timeout: 15000,
                id: 0
            },
            XHR: {
                send: XMLHttpRequest.prototype.send
            },
            checkoutButton: {
                selector: '[data-ocu-checkout]',
                excludes: {
                    tagName: /^P$/,
                    id: /^ProceedToCheckout(Top|Bottom)$/,
                }
            },
            cartDrawerControl: {
                selector: '[data-action="close-drawer"][data-drawer-id="sidebar-cart"], #CartDrawer .drawer__close-button, #CartDrawer .js-drawer-close'
            },
            cartDrawerSalesRocketControl: {
                selector: '#cartSlider-shopper .ws-cs-close',
            },
            cartDrawerTimberControl: {
                selector: '#CartDrawer .js-drawer-close button',
            },
            chatButton: {
                selector: '#shopify-chat'
            },
            termsOfServiceCheckbox: {
                selector: '.cart__terms-checkbox'
            },
            productLocation: {
                variant_id: null,
                product_id: null,
            },
            extraClassListToRemove: [
                'hulkapps_submit_cart'
            ],
            pagesIntegrationData: {}
        },
        event: function(e) {
            return new Event('store:' + e);
        },
        emit: function(e) {
            document.dispatchEvent(this.event(e));
        }
    };

    this.get = function(key) {
        return _private.store[key];
    };

    this.set = function(key, val) {
        if (!_private.store.hasOwnProperty(key)) return console.error('Unavailable key! ', key);
        _private.emit(key);
        _private.store[key] = val;
    };

    this.listen = function(e) {
        return new Promise(function(resolve) {
            document.addEventListener('store:' + e, resolve);
        });
    };
}

}();