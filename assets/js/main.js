/* Beyond Wings Holidays — site behaviour (no dependencies) */
class DCLogic {
  constructor(props) { this.props = props || {}; }
  setState(patch) {
    Object.assign(this.state, typeof patch === 'function' ? patch(this.state) : patch);
    if (window.__bwUpdate) window.__bwUpdate();
  }
  forceUpdate() { if (window.__bwUpdate) window.__bwUpdate(); }
}

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.PLANS = [
      { name: 'Sannidhi Signature', short: 'Signature', sub: 'Spiritual Escape', price: 9999,
        features: ['Premium stay', 'Guruvayur darshan assistance', 'Important place visits', 'Kerala sightseeing', 'Local experiences', 'Food & dining', 'Dedicated travel assistance'] },
      { name: 'Sannidhi Sacred', short: 'Sacred', sub: 'Sacred Luxury', price: 15999,
        features: ['5-star stay', 'Guruvayur darshan assistance', 'Important place visits', 'Premium Kerala sightseeing', 'Ayurvedic spa experience', 'Spiritual experiences', 'Food & dining', 'Personalised travel assistance'] },
      { name: 'Sannidhi Elite', short: 'Elite', sub: 'The Divine, Elevated', price: 19999,
        features: ['5-star backwater resort', '5-star stay experience', 'Houseboat experience', 'Curated Kerala sightseeing', 'Important place visits', 'Ayurvedic wellness experience', 'Premium food & dining', 'Personal photographer', '24/7 dedicated assistance', 'VIP-level hospitality'] }
    ];
    this.TABS = [
      { id: 'flights', label: 'Flights', icon: 'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z' },
      { id: 'holidays', label: 'Holidays', icon: 'M4 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zM16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16' },
      { id: 'sannidhi', label: 'Sannidhi', icon: 'M3 22h18M6 18v-7M10 18v-7M14 18v-7M18 18v-7M12 2l8 5H4z' },
      { id: 'visa', label: 'Visa', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 13h6M9 17h4' }
    ];
    this.DESTS = [
      { name: 'Kerala', region: 'india', line: 'Backwaters, hill stations and temple towns', photo: 'Houseboat among palm trees on the Kerala backwaters', img: 'backwaters' },
      { name: 'Dubai', region: 'intl', line: 'Skylines, souks and desert safaris', photo: 'Burj Khalifa and the Downtown Dubai skyline', img: 'dubai' },
      { name: 'Kashmir', region: 'india', line: 'Valleys, lakes and snow-lined passes', photo: 'Houseboats on a lake below snow-capped mountains in Kashmir', img: 'kashmir' },
      { name: 'Maldives', region: 'intl', line: 'Overwater villas and reef lagoons', photo: 'Overwater villas in the Maldives', img: 'maldives' },
      { name: 'Rajasthan', region: 'india', line: 'Forts, palaces and desert camps', photo: 'Hawa Mahal in Jaipur, Rajasthan', img: 'rajasthan' },
      { name: 'Singapore', region: 'intl', line: 'Gardens, food streets and family fun', photo: 'Marina Bay Sands, Singapore', img: 'singapore' },
      { name: 'Goa', region: 'india', line: 'Beaches, cafés and slow sunsets', photo: 'Colourful beach huts and palm trees in Goa', img: 'goa' },
      { name: 'Thailand', region: 'intl', line: 'Islands, markets and lively nights', photo: 'Boat beside limestone islands in Thailand', img: 'thailand' }
    ];
    this.STEPS = [
      { title: 'Tell us your plan', text: 'Share where, when and who is travelling — by form, call or WhatsApp.' },
      { title: 'Get your itinerary', text: 'We come back with flights, stays and a day-by-day plan for you to review.' },
      { title: 'Travel, fully supported', text: 'Tickets, transfers and on-trip assistance, handled by one team.' }
    ];
    this.state = { tab: 'flights', trip: 'round', from: 'Kochi (COK)', to: 'Dubai (DXB)', pax: 2, searched: false, plan: 1, days: 3, region: 'all', menu: false, sent: false, heroTo: '', step: 0 };
  }
  componentDidMount() {
    var self = this;
    this._startBoard();
    this._timer = setInterval(function () { self.setState({ step: (self.state.step + 1) % 3 }); }, 5000);
  }
  _startBoard() {
    var self = this;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cur = null;
    var measure = function () {
      var site = document.querySelector('.site');
      var b = document.querySelector('.board');
      var doc = document.documentElement;
      var vh = window.innerHeight || 800;
      if (!b || !site || reduce || site.clientWidth <= 1100 || doc.scrollHeight <= vh + 10) return 0;
      var top = b.getBoundingClientRect().top + window.scrollY;
      var end = Math.max(1, top - vh * 0.1);
      return 1 - Math.min(1, Math.max(0, window.scrollY / end));
    };
    var paint = function () {
      var b = document.querySelector('.board');
      if (b) b.style.setProperty('--k', (cur * cur * (3 - 2 * cur)).toFixed(4));
    };
    var tick = function () {
      var target = measure();
      cur += (target - cur) * 0.09;
      if (Math.abs(target - cur) < 0.0004) cur = target;
      paint();
      self._raf = cur !== target ? requestAnimationFrame(tick) : 0;
    };
    var kick = function () { if (!self._raf) self._raf = requestAnimationFrame(tick); };
    cur = measure();
    paint();
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    this._kick = kick;
  }
  componentWillUnmount() {
    if (this._kick) { window.removeEventListener('scroll', this._kick); window.removeEventListener('resize', this._kick); }
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._timer) clearInterval(this._timer);
  }
  renderVals() {
    var s = this.state;
    var self = this;
    var PLANS = this.PLANS;
    var inr = function (n) { return '₹' + n.toLocaleString('en-IN'); };
    var plan = PLANS[s.plan];
    var WASH = ['w-sky', 'w-mint', 'w-peach'];
    return {
      menu: s.menu,
      menuClosed: !s.menu,
      menuExp: s.menu ? 'true' : 'false',
      menuLabel: s.menu ? 'Close menu' : 'Open menu',
      toggleMenu: function () { self.setState({ menu: !self.state.menu }); },
      closeMenu: function () { self.setState({ menu: false }); },

      heroTo: s.heroTo,
      heroEmpty: s.heroTo === '',
      onHeroTo: function (e) { self.setState({ heroTo: e.target.value }); },
      heroGo: function (e) {
        if (e && e.preventDefault) e.preventDefault();
        var dest = self.state.heroTo.trim();
        self.setState({ tab: 'flights', to: dest || self.state.to, searched: false });
        var el = document.getElementById('book');
        if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      },

      tabs: this.TABS.map(function (t) {
        return { label: t.label, icon: t.icon, cls: t.id === s.tab ? 'tab on' : 'tab', sel: t.id === s.tab ? 'true' : 'false',
          pick: function () { self.setState({ tab: t.id, searched: false }); } };
      }),
      isFlights: s.tab === 'flights',
      isHolidays: s.tab === 'holidays',
      isSannidhi: s.tab === 'sannidhi',
      isVisa: s.tab === 'visa',
      isRound: s.trip === 'round',
      oneCls: s.trip === 'one' ? 'on' : '',
      roundCls: s.trip === 'round' ? 'on' : '',
      onePressed: s.trip === 'one' ? 'true' : 'false',
      roundPressed: s.trip === 'round' ? 'true' : 'false',
      setOne: function () { self.setState({ trip: 'one' }); },
      setRound: function () { self.setState({ trip: 'round' }); },
      from: s.from,
      to: s.to,
      onFrom: function (e) { self.setState({ from: e.target.value, searched: false }); },
      onTo: function (e) { self.setState({ to: e.target.value, searched: false }); },
      swap: function () { self.setState({ from: self.state.to, to: self.state.from, searched: false }); },
      pax: s.pax,
      paxDec: function () { self.setState({ pax: Math.max(1, self.state.pax - 1) }); },
      paxInc: function () { self.setState({ pax: Math.min(9, self.state.pax + 1) }); },
      searched: s.searched,
      search: function (e) { if (e && e.preventDefault) e.preventDefault(); self.setState({ searched: true }); },

      plans: PLANS.map(function (p, i) {
        var on = i === s.plan;
        return { short: p.short, cls: on ? 'on' : '', sel: on ? 'true' : 'false', pick: function () { self.setState({ plan: i }); } };
      }),
      planName: plan.name,
      bookLabel: "Book " + plan.name,
      planPrice: inr(plan.price),
      planSub: plan.sub,
      planFeatures: plan.features,
      planStr: String(s.plan),
      onPlanSel: function (e) { self.setState({ plan: parseInt(e.target.value, 10) || 0 }); },
      days: s.days,
      daysDec: function () { self.setState({ days: Math.max(1, self.state.days - 1) }); },
      daysInc: function () { self.setState({ days: Math.min(14, self.state.days + 1) }); },
      total: inr(plan.price * s.days),

      filters: [['all', 'All'], ['india', 'India'], ['intl', 'International']].map(function (f) {
        return { label: f[1], cls: f[0] === s.region ? 'on' : '', sel: f[0] === s.region ? 'true' : 'false',
          pick: function () { self.setState({ region: f[0] }); } };
      }),
      dests: this.DESTS.filter(function (d) { return s.region === 'all' || d.region === s.region; }).map(function (d, i) {
        return { name: d.name, line: d.line, photo: d.photo, regionLabel: d.region === 'india' ? 'India' : 'International', imgCls: 'ph-img photo dest-img img-' + d.img };
      }),

      steps: this.STEPS.map(function (st, i) {
        var on = i === s.step;
        return { title: st.title, text: st.text, on: on, sel: on ? 'true' : 'false', cls: on ? 'step on' : 'step',
          pick: function () {
            if (self._timer) clearInterval(self._timer);
            self._timer = setInterval(function () { self.setState({ step: (self.state.step + 1) % 3 }); }, 5000);
            self.setState({ step: i });
          } };
      }),
      step0: s.step === 0, step1: s.step === 1, step2: s.step === 2,
      tool0: s.step === 0 ? 'on' : '', tool1: s.step === 1 ? 'on' : '', tool2: s.step === 2 ? 'on' : '',

      sent: s.sent,
      notSent: !s.sent,
      submit: function (e) { if (e && e.preventDefault) e.preventDefault(); self.setState({ sent: true }); },
      reset: function () { self.setState({ sent: false }); }
    };
  }
}

(function () {
  var comp = new Component({});
  var view = comp.renderVals();
  function get(o, p) { return p.split('.').reduce(function (a, k) { return a == null ? undefined : a[k]; }, o); }
  function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  var queued = false;
  function update() {
    view = comp.renderVals();
    document.querySelectorAll('[data-bind]').forEach(function (el) {
      var v = get(view, el.getAttribute('data-bind')); v = v == null ? '' : String(v);
      if (el.textContent !== v) el.textContent = v;
    });
    document.querySelectorAll('*').forEach(function (el) {
      for (var i = 0; i < el.attributes.length; i++) {
        var a = el.attributes[i];
        if (a.name.indexOf('data-bind-') !== 0) continue;
        var attr = a.name.slice(10), v = get(view, a.value); v = v == null ? '' : String(v);
        if (attr === 'value') { if (el.value !== v && document.activeElement !== el) el.value = v; }
        else if (attr === 'class') { if (el.className !== v) el.className = v; }
        else if (el.getAttribute(attr) !== v) el.setAttribute(attr, v);
      }
    });
    document.querySelectorAll('[data-if]').forEach(function (el) { el.hidden = !get(view, el.getAttribute('data-if')); });
    var tpl = document.querySelector('template[data-tpl="planFeatures"]');
    document.querySelectorAll('[data-list="planFeatures"]').forEach(function (el) {
      var html = view.planFeatures.map(function (f) { return tpl.innerHTML.replace(/\{\{\s*f\s*\}\}/g, esc(f)); }).join('');
      if (el.getAttribute('data-sig') !== view.planFeatures.join('|')) { el.innerHTML = html; el.setAttribute('data-sig', view.planFeatures.join('|')); }
    });
    var shown = {}; view.dests.forEach(function (d) { shown[d.name] = true; });
    document.querySelectorAll('.dest[data-name]').forEach(function (el) { el.hidden = !shown[el.getAttribute('data-name')]; });
  }
  window.__bwUpdate = function () { if (queued) return; queued = true; Promise.resolve().then(function () { queued = false; update(); }); };
  function call(path, e) { var fn = get(view, path); if (typeof fn === 'function') fn(e); }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]'); if (el) call(el.getAttribute('data-action'), e);
  });
  document.addEventListener('input', function (e) {
    var el = e.target.closest('[data-change]'); if (el) call(el.getAttribute('data-change'), e);
  });
  document.addEventListener('change', function (e) {
    var el = e.target.closest('select[data-change]'); if (el) call(el.getAttribute('data-change'), e);
  });
  document.addEventListener('submit', function (e) {
    var el = e.target.closest('[data-submit]'); if (el) { e.preventDefault(); call(el.getAttribute('data-submit'), e); }
  });
  update();
  if (comp.componentDidMount) comp.componentDidMount();
})();
