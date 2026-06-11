// 旧版（无 locale 前缀）URL 的语言协商跳转：
// 优先使用语言切换器保存的偏好，其次匹配浏览器语言，最后回退到 en-us。
(function () {
  var supported = [
    'ar', 'ca', 'cs', 'da', 'de', 'el',
    'en-au', 'en-ca', 'en-gb', 'en-us',
    'es-es', 'es-mx', 'fi', 'fr-ca', 'fr-fr',
    'he', 'hi', 'hr', 'hu', 'id', 'it', 'ja', 'ko', 'ms',
    'nb', 'nl', 'pl', 'pt-br', 'pt-pt', 'ro', 'ru', 'sk', 'sv',
    'th', 'tr', 'uk', 'vi', 'zh-hans', 'zh-hant'
  ];
  var alias = {
    en: 'en-us',
    fr: 'fr-fr',
    es: 'es-es',
    'es-419': 'es-mx',
    pt: 'pt-br',
    zh: 'zh-hans',
    'zh-cn': 'zh-hans',
    'zh-sg': 'zh-hans',
    'zh-my': 'zh-hans',
    'zh-tw': 'zh-hant',
    'zh-hk': 'zh-hant',
    'zh-mo': 'zh-hant',
    no: 'nb',
    nn: 'nb',
    iw: 'he',
    'in': 'id'
  };

  var candidates = [];
  try {
    var stored = localStorage.getItem('selfstudio-locale');
    if (stored) candidates.push(stored);
  } catch (e) { /* localStorage 不可用 */ }
  var navLangs = navigator.languages || [navigator.language || 'en-US'];
  for (var i = 0; i < navLangs.length; i++) {
    candidates.push(String(navLangs[i]).toLowerCase());
  }

  function resolve(code) {
    if (supported.indexOf(code) !== -1) return code;
    if (alias[code]) return alias[code];
    var base = code.split('-')[0];
    if (supported.indexOf(base) !== -1) return base;
    if (alias[base]) return alias[base];
    for (var k = 0; k < supported.length; k++) {
      if (supported[k].split('-')[0] === base) return supported[k];
    }
    return null;
  }

  var target = null;
  for (var j = 0; j < candidates.length && !target; j++) {
    target = resolve(candidates[j]);
  }
  if (!target) target = 'en-us';

  location.replace('/' + target + location.pathname + location.search + location.hash);
})();
