document.addEventListener('click', async function (event) { const button = event.target.closest('.code-copy'); if (!button) return; const block = button.closest('.code-block'); const code = block && block.querySelector('.code-shell code'); if (!code) return; const original = button.textContent; try { await navigator.clipboard.writeText(code.textContent); button.textContent = 'Kopiert'; } catch (e) { button.textContent = 'Bitte markieren'; } window.setTimeout(function () { button.textContent = original; }, 1800); });

/* Abgesicherte Syntaxfarbung für nachträglich importierte PowerShell-Runbooks.
   Das Markup wird ausschließlich per textContent und createElement erzeugt.
   So bleiben Quellcode, Whitespace und "Kopieren" exakt erhalten. */
(function () {
  'use strict';

  function tokenizePowerShell(source) {
    var tokens = [];
    function add(kind, value) {
      if (!value) return;
      var last = tokens[tokens.length - 1];
      if (last && last.kind === kind) last.text += value;
      else tokens.push({kind: kind, text: value});
    }
    var keywords = /^(if|else|elseif|foreach|for|try|catch|finally|return|switch|while|break|continue|param|function|throw|in|begin|process|end|do|until)$/i;
    var operators = /^(eq|ne|lt|le|gt|ge|like|notlike|match|notmatch|in|notin|contains|notcontains|is|isnot|and|or|not|band|bor|bxor)$/i;
    var commands = /^(winget|whoami|net|gpresult|ipconfig|ping|tracert|nslookup|reg|reg\.exe|msiexec|msiexec\.exe|route|sfc|dism|icacls|tasklist|where|where\.exe)$/i;
    var i = 0;
    while (i < source.length) {
      var rest = source.slice(i);
      var c = source[i], match, end, quote;
      if (/\s/.test(c)) {
        match = rest.match(/^\s+/);
        add('', match[0]); i += match[0].length; continue;
      }
      if (c === '#') {
        end = source.indexOf('\n', i);
        if (end === -1) end = source.length;
        add('c', source.slice(i, end)); i = end; continue;
      }
      if (c === '"' || c === "'") {
        quote = c; end = i + 1;
        while (end < source.length) {
          if (source[end] === '`' && quote === '"') { end += 2; continue; }
          if (source[end] === quote) {
            if (source[end + 1] === quote) { end += 2; continue; }
            end++; break;
          }
          end++;
        }
        add(quote === "'" ? 's1' : 's2', source.slice(i, end));
        i = end; continue;
      }
      match = rest.match(/^\$(?:\{[^}]*\}|(?:[A-Za-z_?][\w?]*:)?[A-Za-z_?][\w?]*|\d+)/);
      if (match) { add('nv', match[0]); i += match[0].length; continue; }
      match = rest.match(/^\[[A-Za-z_][\w.]*\]/);
      if (match) { add('nf', match[0]); i += match[0].length; continue; }
      match = rest.match(/^-([A-Za-z][\w-]*)/);
      if (match) {
        add(operators.test(match[1]) ? 'o' : 'na', match[0]);
        i += match[0].length; continue;
      }
      match = rest.match(/^\d+(?:\.\d+)?/);
      if (match) { add('mi', match[0]); i += match[0].length; continue; }
      match = rest.match(/^[A-Za-z_][\w.]*-[A-Za-z_][\w.-]*/);
      if (match) { add('nb', match[0]); i += match[0].length; continue; }
      match = rest.match(/^[A-Za-z_][\w.]*/);
      if (match) {
        add(keywords.test(match[0]) ? 'k' : commands.test(match[0]) ? 'nb' : '', match[0]);
        i += match[0].length; continue;
      }
      add('', c); i++;
    }
    return tokens;
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.code-block').forEach(function (block) {
      var code = block.querySelector('.code-shell code');
      if (!code || code.querySelector('span')) return; // RB-001 bis RB-010 schon farbig.
      var source = code.textContent || '';
      var isPowerShell = code.classList.contains('language-powershell') ||
        (code.classList.contains('language-text') &&
          /^\s*#/m.test(source) &&
          /(?:\b(?:Get|Set|New|Remove|Start|Stop|Test|Resolve|Select|Connect|Disconnect|Import|Export|Update|Invoke|Add|Clear|Join|Measure|Format|Out|Write|ForEach|Where)-[\w-]+|\$[A-Za-z]|\b(?:winget|gpresult|whoami|net\s+use|reg\.exe|msiexec\.exe)\b)/i.test(source));
      if (!isPowerShell) return;

      var parts = tokenizePowerShell(source), fragment = document.createDocumentFragment();
      parts.forEach(function (part) {
        if (part.kind) {
          var span = document.createElement('span');
          span.className = part.kind;
          span.textContent = part.text;
          fragment.appendChild(span);
        } else fragment.appendChild(document.createTextNode(part.text));
      });
      // Wichtig für die Kopierfunktion: identischer Quelltext, nur Farbauszeichnung.
      if (parts.map(function (p) {return p.text;}).join('') !== source) return;
      code.replaceChildren(fragment);
      code.classList.remove('language-text');
      code.classList.add('language-powershell');
      var caption = block.querySelector('.code-lang');
      if (caption) caption.textContent = 'powershell';
    });
  });
})();
