/* esm.sh - esbuild bundle(preact@10.19.1) es2022 production */
var D,d,J,ne,C,j,K,$,Q,E={},X=[],oe=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,F=Array.isArray;function b(e,_){for(var t in _)e[t]=_[t];return e}function Y(e){var _=e.parentNode;_&&_.removeChild(e)}function re(e,_,t){var l,o,r,i={};for(r in _)r=="key"?l=_[r]:r=="ref"?o=_[r]:i[r]=_[r];if(arguments.length>2&&(i.children=arguments.length>3?D.call(arguments,2):t),typeof e=="function"&&e.defaultProps!=null)for(r in e.defaultProps)i[r]===void 0&&(i[r]=e.defaultProps[r]);return S(e,i,l,o,null)}function S(e,_,t,l,o){var r={type:e,props:_,key:t,ref:l,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:o??++J,__i:-1,__u:0};return o==null&&d.vnode!=null&&d.vnode(r),r}function ae(){return{current:null}}function H(e){return e.children}function W(e,_){this.props=e,this.context=_}function P(e,_){if(_==null)return e.__?P(e.__,e.__i+1):null;for(var t;_<e.__k.length;_++)if((t=e.__k[_])!=null&&t.__e!=null)return t.__e;return typeof e.type=="function"?P(e):null}function Z(e){var _,t;if((e=e.__)!=null&&e.__c!=null){for(e.__e=e.__c.base=null,_=0;_<e.__k.length;_++)if((t=e.__k[_])!=null&&t.__e!=null){e.__e=e.__c.base=t.__e;break}return Z(e)}}function I(e){(!e.__d&&(e.__d=!0)&&C.push(e)&&!A.__r++||j!==d.debounceRendering)&&((j=d.debounceRendering)||K)(A)}function A(){var e,_,t,l,o,r,i,s,c;for(C.sort($);e=C.shift();)e.__d&&(_=C.length,l=void 0,r=(o=(t=e).__v).__e,s=[],c=[],(i=t.__P)&&((l=b({},o)).__v=o.__v+1,B(i,l,o,t.__n,i.ownerSVGElement!==void 0,32&o.__u?[r]:null,s,r??P(o),!!(32&o.__u),c),l.__.__k[l.__i]=l,te(s,l,c),l.__e!=r&&Z(l)),C.length>_&&C.sort($));A.__r=0}function ee(e,_,t,l,o,r,i,s,c,u,p){var n,m,f,h,k,v=l&&l.__k||X,a=_.length;for(t.__d=c,le(t,_,v),c=t.__d,n=0;n<a;n++)(f=t.__k[n])!=null&&typeof f!="boolean"&&typeof f!="function"&&(m=f.__i===-1?E:v[f.__i]||E,f.__i=n,B(e,f,m,o,r,i,s,c,u,p),h=f.__e,f.ref&&m.ref!=f.ref&&(m.ref&&O(m.ref,null,f),p.push(f.ref,f.__c||h,f)),k==null&&h!=null&&(k=h),65536&f.__u||m.__k===f.__k?c=_e(f,c,e):typeof f.type=="function"&&f.__d!==void 0?c=f.__d:h&&(c=h.nextSibling),f.__d=void 0,f.__u&=-196609);t.__d=c,t.__e=k}function le(e,_,t){var l,o,r,i,s,c=_.length,u=t.length,p=u,n=0;for(e.__k=[],l=0;l<c;l++)(o=e.__k[l]=(o=_[l])==null||typeof o=="boolean"||typeof o=="function"?null:typeof o=="string"||typeof o=="number"||typeof o=="bigint"||o.constructor==String?S(null,o,null,null,o):F(o)?S(H,{children:o},null,null,null):o.__b>0?S(o.type,o.props,o.key,o.ref?o.ref:null,o.__v):o)!=null?(o.__=e,o.__b=e.__b+1,s=se(o,t,i=l+n,p),o.__i=s,r=null,s!==-1&&(p--,(r=t[s])&&(r.__u|=131072)),r==null||r.__v===null?(s==-1&&n--,typeof o.type!="function"&&(o.__u|=65536)):s!==i&&(s===i+1?n++:s>i?p>c-i?n+=s-i:n--:n=s<i&&s==i-1?s-i:0,s!==l+n&&(o.__u|=65536))):(r=t[l])&&r.key==null&&r.__e&&(r.__e==e.__d&&(e.__d=P(r)),R(r,r,!1),t[l]=null,p--);if(p)for(l=0;l<u;l++)(r=t[l])!=null&&!(131072&r.__u)&&(r.__e==e.__d&&(e.__d=P(r)),R(r,r))}function _e(e,_,t){var l,o;if(typeof e.type=="function"){for(l=e.__k,o=0;l&&o<l.length;o++)l[o]&&(l[o].__=e,_=_e(l[o],_,t));return _}return e.__e!=_&&(t.insertBefore(e.__e,_||null),_=e.__e),_&&_.nextSibling}function ie(e,_){return _=_||[],e==null||typeof e=="boolean"||(F(e)?e.some(function(t){ie(t,_)}):_.push(e)),_}function se(e,_,t,l){var o=e.key,r=e.type,i=t-1,s=t+1,c=_[t];if(c===null||c&&o==c.key&&r===c.type)return t;if(l>(c!=null&&!(131072&c.__u)?1:0))for(;i>=0||s<_.length;){if(i>=0){if((c=_[i])&&!(131072&c.__u)&&o==c.key&&r===c.type)return i;i--}if(s<_.length){if((c=_[s])&&!(131072&c.__u)&&o==c.key&&r===c.type)return s;s++}}return-1}function z(e,_,t){_[0]==="-"?e.setProperty(_,t??""):e[_]=t==null?"":typeof t!="number"||oe.test(_)?t:t+"px"}function M(e,_,t,l,o){var r;e:if(_==="style")if(typeof t=="string")e.style.cssText=t;else{if(typeof l=="string"&&(e.style.cssText=l=""),l)for(_ in l)t&&_ in t||z(e.style,_,"");if(t)for(_ in t)l&&t[_]===l[_]||z(e.style,_,t[_])}else if(_[0]==="o"&&_[1]==="n")r=_!==(_=_.replace(/(PointerCapture)$|Capture$/,"$1")),_=_.toLowerCase()in e?_.toLowerCase().slice(2):_.slice(2),e.l||(e.l={}),e.l[_+r]=t,t?l?t.u=l.u:(t.u=Date.now(),e.addEventListener(_,r?q:G,r)):e.removeEventListener(_,r?q:G,r);else{if(o)_=_.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(_!=="width"&&_!=="height"&&_!=="href"&&_!=="list"&&_!=="form"&&_!=="tabIndex"&&_!=="download"&&_!=="rowSpan"&&_!=="colSpan"&&_!=="role"&&_ in e)try{e[_]=t??"";break e}catch{}typeof t=="function"||(t==null||t===!1&&_[4]!=="-"?e.removeAttribute(_):e.setAttribute(_,t))}}function G(e){var _=this.l[e.type+!1];if(e.t){if(e.t<=_.u)return}else e.t=Date.now();return _(d.event?d.event(e):e)}function q(e){return this.l[e.type+!0](d.event?d.event(e):e)}function B(e,_,t,l,o,r,i,s,c,u){var p,n,m,f,h,k,v,a,y,x,T,w,V,U,N,g=_.type;if(_.constructor!==void 0)return null;128&t.__u&&(c=!!(32&t.__u),r=[s=_.__e=t.__e]),(p=d.__b)&&p(_);e:if(typeof g=="function")try{if(a=_.props,y=(p=g.contextType)&&l[p.__c],x=p?y?y.props.value:p.__:l,t.__c?v=(n=_.__c=t.__c).__=n.__E:("prototype"in g&&g.prototype.render?_.__c=n=new g(a,x):(_.__c=n=new W(a,x),n.constructor=g,n.render=fe),y&&y.sub(n),n.props=a,n.state||(n.state={}),n.context=x,n.__n=l,m=n.__d=!0,n.__h=[],n._sb=[]),n.__s==null&&(n.__s=n.state),g.getDerivedStateFromProps!=null&&(n.__s==n.state&&(n.__s=b({},n.__s)),b(n.__s,g.getDerivedStateFromProps(a,n.__s))),f=n.props,h=n.state,n.__v=_,m)g.getDerivedStateFromProps==null&&n.componentWillMount!=null&&n.componentWillMount(),n.componentDidMount!=null&&n.__h.push(n.componentDidMount);else{if(g.getDerivedStateFromProps==null&&a!==f&&n.componentWillReceiveProps!=null&&n.componentWillReceiveProps(a,x),!n.__e&&(n.shouldComponentUpdate!=null&&n.shouldComponentUpdate(a,n.__s,x)===!1||_.__v===t.__v)){for(_.__v!==t.__v&&(n.props=a,n.state=n.__s,n.__d=!1),_.__e=t.__e,_.__k=t.__k,_.__k.forEach(function(L){L&&(L.__=_)}),T=0;T<n._sb.length;T++)n.__h.push(n._sb[T]);n._sb=[],n.__h.length&&i.push(n);break e}n.componentWillUpdate!=null&&n.componentWillUpdate(a,n.__s,x),n.componentDidUpdate!=null&&n.__h.push(function(){n.componentDidUpdate(f,h,k)})}if(n.context=x,n.props=a,n.__P=e,n.__e=!1,w=d.__r,V=0,"prototype"in g&&g.prototype.render){for(n.state=n.__s,n.__d=!1,w&&w(_),p=n.render(n.props,n.state,n.context),U=0;U<n._sb.length;U++)n.__h.push(n._sb[U]);n._sb=[]}else do n.__d=!1,w&&w(_),p=n.render(n.props,n.state,n.context),n.state=n.__s;while(n.__d&&++V<25);n.state=n.__s,n.getChildContext!=null&&(l=b(b({},l),n.getChildContext())),m||n.getSnapshotBeforeUpdate==null||(k=n.getSnapshotBeforeUpdate(f,h)),ee(e,F(N=p!=null&&p.type===H&&p.key==null?p.props.children:p)?N:[N],_,t,l,o,r,i,s,c,u),n.base=_.__e,_.__u&=-161,n.__h.length&&i.push(n),v&&(n.__E=n.__=null)}catch(L){_.__v=null,c||r!=null?(_.__e=s,_.__u|=c?160:32,r[r.indexOf(s)]=null):(_.__e=t.__e,_.__k=t.__k),d.__e(L,_,t)}else r==null&&_.__v===t.__v?(_.__k=t.__k,_.__e=t.__e):_.__e=ue(t.__e,_,t,l,o,r,i,c,u);(p=d.diffed)&&p(_)}function te(e,_,t){_.__d=void 0;for(var l=0;l<t.length;l++)O(t[l],t[++l],t[++l]);d.__c&&d.__c(_,e),e.some(function(o){try{e=o.__h,o.__h=[],e.some(function(r){r.call(o)})}catch(r){d.__e(r,o.__v)}})}function ue(e,_,t,l,o,r,i,s,c){var u,p,n,m,f,h,k,v=t.props,a=_.props,y=_.type;if(y==="svg"&&(o=!0),r!=null){for(u=0;u<r.length;u++)if((f=r[u])&&"setAttribute"in f==!!y&&(y?f.localName===y:f.nodeType===3)){e=f,r[u]=null;break}}if(e==null){if(y===null)return document.createTextNode(a);e=o?document.createElementNS("http://www.w3.org/2000/svg",y):document.createElement(y,a.is&&a),r=null,s=!1}if(y===null)v===a||s&&e.data===a||(e.data=a);else{if(r=r&&D.call(e.childNodes),v=t.props||E,!s&&r!=null)for(v={},u=0;u<e.attributes.length;u++)v[(f=e.attributes[u]).name]=f.value;for(u in v)f=v[u],u=="children"||(u=="dangerouslySetInnerHTML"?n=f:u==="key"||u in a||M(e,u,null,f,o));for(u in a)f=a[u],u=="children"?m=f:u=="dangerouslySetInnerHTML"?p=f:u=="value"?h=f:u=="checked"?k=f:u==="key"||s&&typeof f!="function"||v[u]===f||M(e,u,f,v[u],o);if(p)s||n&&(p.__html===n.__html||p.__html===e.innerHTML)||(e.innerHTML=p.__html),_.__k=[];else if(n&&(e.innerHTML=""),ee(e,F(m)?m:[m],_,t,l,o&&y!=="foreignObject",r,i,r?r[0]:t.__k&&P(t,0),s,c),r!=null)for(u=r.length;u--;)r[u]!=null&&Y(r[u]);s||(u="value",h!==void 0&&(h!==e[u]||y==="progress"&&!h||y==="option"&&h!==v[u])&&M(e,u,h,v[u],!1),u="checked",k!==void 0&&k!==e[u]&&M(e,u,k,v[u],!1))}return e}function O(e,_,t){try{typeof e=="function"?e(_):e.current=_}catch(l){d.__e(l,t)}}function R(e,_,t){var l,o;if(d.unmount&&d.unmount(e),(l=e.ref)&&(l.current&&l.current!==e.__e||O(l,null,_)),(l=e.__c)!=null){if(l.componentWillUnmount)try{l.componentWillUnmount()}catch(r){d.__e(r,_)}l.base=l.__P=null,e.__c=void 0}if(l=e.__k)for(o=0;o<l.length;o++)l[o]&&R(l[o],_,t||typeof e.type!="function");t||e.__e==null||Y(e.__e),e.__=e.__e=e.__d=void 0}function fe(e,_,t){return this.constructor(e,t)}function ce(e,_,t){var l,o,r,i;d.__&&d.__(e,_),o=(l=typeof t=="function")?null:t&&t.__k||_.__k,r=[],i=[],B(_,e=(!l&&t||_).__k=re(H,null,[e]),o||E,E,_.ownerSVGElement!==void 0,!l&&t?[t]:o?null:_.firstChild?D.call(_.childNodes):null,r,!l&&t?t:o?o.__e:_.firstChild,l,i),te(r,e,i)}function pe(e,_){ce(e,_,pe)}function de(e,_,t){var l,o,r,i,s=b({},e.props);for(r in e.type&&e.type.defaultProps&&(i=e.type.defaultProps),_)r=="key"?l=_[r]:r=="ref"?o=_[r]:s[r]=_[r]===void 0&&i!==void 0?i[r]:_[r];return arguments.length>2&&(s.children=arguments.length>3?D.call(arguments,2):t),S(e.type,s,l||e.key,o||e.ref,null)}function he(e,_){var t={__c:_="__cC"+Q++,__:e,Consumer:function(l,o){return l.children(o)},Provider:function(l){var o,r;return this.getChildContext||(o=[],(r={})[_]=this,this.getChildContext=function(){return r},this.shouldComponentUpdate=function(i){this.props.value!==i.value&&o.some(function(s){s.__e=!0,I(s)})},this.sub=function(i){o.push(i);var s=i.componentWillUnmount;i.componentWillUnmount=function(){o.splice(o.indexOf(i),1),s&&s.call(i)}}),l.children}};return t.Provider.__=t.Consumer.contextType=t}D=X.slice,d={__e:function(e,_,t,l){for(var o,r,i;_=_.__;)if((o=_.__c)&&!o.__)try{if((r=o.constructor)&&r.getDerivedStateFromError!=null&&(o.setState(r.getDerivedStateFromError(e)),i=o.__d),o.componentDidCatch!=null&&(o.componentDidCatch(e,l||{}),i=o.__d),i)return o.__E=o}catch(s){e=s}throw e}},J=0,ne=function(e){return e!=null&&e.constructor==null},W.prototype.setState=function(e,_){var t;t=this.__s!=null&&this.__s!==this.state?this.__s:this.__s=b({},this.state),typeof e=="function"&&(e=e(b({},t),this.props)),e&&b(t,e),e!=null&&this.__v&&(_&&this._sb.push(_),I(this))},W.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),I(this))},W.prototype.render=H,C=[],K=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,$=function(e,_){return e.__v.__b-_.__v.__b},A.__r=0,Q=0;export{W as Component,H as Fragment,de as cloneElement,he as createContext,re as createElement,ae as createRef,re as h,pe as hydrate,ne as isValidElement,d as options,ce as render,ie as toChildArray};
//# sourceMappingURL=preact.mjs.map