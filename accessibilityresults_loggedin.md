
 ## Settings 

 - ### Issue 0 
 - Description: Ensures iframe and frame elements have an accessible name 
 - Help:  Frames must have an accessible name 
 - Help URL:  https://dequeuniversity.com/rules/axe/4.9/frame-title?application=playwright 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <iframe id="sbox-iframe" src="http://localhost:3001/drive/inner.html?ver=2024.3.0-1721738067427-1721738336064#%7B%22cfg%22%3A%7B%22baseUrl%22%3A%22%2Fdrive%2F%22%2C%22paths%22%3A%7B%22text%22%3A%22%2Fcomponents%2Frequirejs-plugins%2Flib%2Ftext%22%2C%22json%22%3A%22%2Fcomponents%2Frequirejs-plugins%2Fsrc%2Fjson%22%2C%22optional%22%3A%22%2Flib%2Foptional%2Foptional%22%2C%22jquery%22%3A%22%2Fcomponents%2Fjquery%2Fdist%2Fjquery.min%22%2C%22mermaid%22%3A%22%2Flib%2Fmermaid%2Fmermaid.min%22%2C%22json.sortify%22%3A%22%2Fcomponents%2Fjson.sortify%2Fdist%2FJSON.sortify%22%2C%22cm%22%3A%22%2Fcomponents%2Fcodemirror%22%2C%22tui-code-snippet%22%3A%22%2Flib%2Fcalendar%2Ftui-code-snippet.min%22%2C%22tui-date-picker%22%3A%22%2Flib%2Fcalendar%2Fdate-picker%22%2C%22netflux-client%22%3A%22%2Fcomponents%2Fnetflux-websocket%2Fnetflux-client%22%2C%22chainpad-netflux%22%3A%22%2Fcomponents%2Fchainpad-netflux%2Fchainpad-netflux%22%2C%22chainpad-listmap%22%3A%22%2Fcomponents%2Fchainpad-listmap%2Fchainpad-listmap%22%2C%22cm-extra%22%3A%22%2Flib%2Fcodemirror-extra-modes%22%2C%22asciidoctor%22%3A%22%2Flib%2Fasciidoctor%2Fasciidoctor.min%22%7D%2C%22map%22%3A%7B%22*%22%3A%7B%22css%22%3A%22%2Fcomponents%2Frequire-css%2Fcss.js%22%2C%22less%22%3A%22%2Fcommon%2FRequireLess.js%22%2C%22%2Fbower_components%2Ftweetnacl%2Fnacl-fast.min.js%22%3A%22%2Fcomponents%2Ftweetnacl%2Fnacl-fast.min.js%22%7D%7D%2C%22waitSeconds%22%3A600%2C%22urlArgs%22%3A%22ver%3D2024.3.0-1721738067427-1721738336064%22%7D%2C%22req%22%3A%5B%22%2Fcommon%2Floading.js%22%5D%2C%22pfx%22%3A%22http%3A%2F%2Flocalhost%3A3000%22%2C%22themeOS%22%3A%22light%22%2C%22lang%22%3A%22en%22%2C%22time%22%3A1721738335625%7D" allowfullscreen="true" allow="clipboard-write">``` 
       - Fix any of the following:  Element has no title attribute  aria-label attribute does not exist or is empty  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty  Element's default semantics were not overridden with role="none" or role="presentation" 
      - Severity: serious 

 - ### Issue 1 
 - Description: Ensures every HTML document has a lang attribute 
 - Help:  <html> element must have a lang attribute 
 - Help URL:  https://dequeuniversity.com/rules/axe/4.9/html-has-lang?application=playwright 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <html>``` 
       - Fix any of the following:  The <html> element does not have a lang attribute 
      - Severity: serious 

 - ### Issue 2 
 - Description: Ensures all page content is contained by landmarks 
 - Help:  All page content should be contained by landmarks 
 - Help URL:  https://dequeuniversity.com/rules/axe/4.9/region?application=playwright 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <div id="placeholder"><div class="placeholder-logo-container" style="opacity: 100;"><img class="placeholder-logo" alt="CryptPad Logo" src="/customize/CryptPad_logo.svg"></div><div class="placeholder-message-container" style="opacity: 100;"><p>Loading...</p></div></div>``` 
       - Fix any of the following:  Some page content is not contained by landmarks 
      - Severity: moderate 

 ## Calendar 

 - ### Issue 0 
 - Description: Ensures iframe and frame elements have an accessible name 
 - Help:  Frames must have an accessible name 
 - Help URL:  https://dequeuniversity.com/rules/axe/4.9/frame-title?application=playwright 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <iframe id="sbox-iframe" src="http://localhost:3001/calendar/inner.html?ver=2024.3.0-1721738067427-1721738397787#%7B%22cfg%22%3A%7B%22baseUrl%22%3A%22%2Fcalendar%2F%22%2C%22paths%22%3A%7B%22text%22%3A%22%2Fcomponents%2Frequirejs-plugins%2Flib%2Ftext%22%2C%22json%22%3A%22%2Fcomponents%2Frequirejs-plugins%2Fsrc%2Fjson%22%2C%22optional%22%3A%22%2Flib%2Foptional%2Foptional%22%2C%22jquery%22%3A%22%2Fcomponents%2Fjquery%2Fdist%2Fjquery.min%22%2C%22mermaid%22%3A%22%2Flib%2Fmermaid%2Fmermaid.min%22%2C%22json.sortify%22%3A%22%2Fcomponents%2Fjson.sortify%2Fdist%2FJSON.sortify%22%2C%22cm%22%3A%22%2Fcomponents%2Fcodemirror%22%2C%22tui-code-snippet%22%3A%22%2Flib%2Fcalendar%2Ftui-code-snippet.min%22%2C%22tui-date-picker%22%3A%22%2Flib%2Fcalendar%2Fdate-picker%22%2C%22netflux-client%22%3A%22%2Fcomponents%2Fnetflux-websocket%2Fnetflux-client%22%2C%22chainpad-netflux%22%3A%22%2Fcomponents%2Fchainpad-netflux%2Fchainpad-netflux%22%2C%22chainpad-listmap%22%3A%22%2Fcomponents%2Fchainpad-listmap%2Fchainpad-listmap%22%2C%22cm-extra%22%3A%22%2Flib%2Fcodemirror-extra-modes%22%2C%22asciidoctor%22%3A%22%2Flib%2Fasciidoctor%2Fasciidoctor.min%22%7D%2C%22map%22%3A%7B%22*%22%3A%7B%22css%22%3A%22%2Fcomponents%2Frequire-css%2Fcss.js%22%2C%22less%22%3A%22%2Fcommon%2FRequireLess.js%22%2C%22%2Fbower_components%2Ftweetnacl%2Fnacl-fast.min.js%22%3A%22%2Fcomponents%2Ftweetnacl%2Fnacl-fast.min.js%22%7D%7D%2C%22waitSeconds%22%3A600%2C%22urlArgs%22%3A%22ver%3D2024.3.0-1721738067427-1721738397787%22%7D%2C%22req%22%3A%5B%22%2Fcommon%2Floading.js%22%5D%2C%22pfx%22%3A%22http%3A%2F%2Flocalhost%3A3000%22%2C%22themeOS%22%3A%22light%22%2C%22lang%22%3A%22en%22%2C%22time%22%3A1721738397439%7D" allowfullscreen="true" allow="clipboard-write">``` 
       - Fix any of the following:  Element has no title attribute  aria-label attribute does not exist or is empty  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty  Element's default semantics were not overridden with role="none" or role="presentation" 
      - Severity: serious 

 - ### Issue 1 
 - Description: Ensures every HTML document has a lang attribute 
 - Help:  <html> element must have a lang attribute 
 - Help URL:  https://dequeuniversity.com/rules/axe/4.9/html-has-lang?application=playwright 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <html>``` 
       - Fix any of the following:  The <html> element does not have a lang attribute 
      - Severity: serious 

 - ### Issue 2 
 - Description: Ensures all page content is contained by landmarks 
 - Help:  All page content should be contained by landmarks 
 - Help URL:  https://dequeuniversity.com/rules/axe/4.9/region?application=playwright 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <div id="placeholder"><div class="placeholder-logo-container" style="opacity: 100;"><img class="placeholder-logo" alt="CryptPad Logo" src="/customize/CryptPad_logo.svg"></div><div class="placeholder-message-container" style="opacity: 100;"><p>Loading...</p></div></div>``` 
       - Fix any of the following:  Some page content is not contained by landmarks 
      - Severity: moderate 

 ## Drive (user) 

 - ### Issue 0 
 - Description: Ensures iframe and frame elements have an accessible name 
 - Help:  Frames must have an accessible name 
 - Help URL:  https://dequeuniversity.com/rules/axe/4.9/frame-title?application=playwright 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <iframe id="sbox-iframe" src="http://localhost:3001/drive/inner.html?ver=2024.3.0-1721738067427-1721738430785#%7B%22cfg%22%3A%7B%22baseUrl%22%3A%22%2Fdrive%2F%22%2C%22paths%22%3A%7B%22text%22%3A%22%2Fcomponents%2Frequirejs-plugins%2Flib%2Ftext%22%2C%22json%22%3A%22%2Fcomponents%2Frequirejs-plugins%2Fsrc%2Fjson%22%2C%22optional%22%3A%22%2Flib%2Foptional%2Foptional%22%2C%22jquery%22%3A%22%2Fcomponents%2Fjquery%2Fdist%2Fjquery.min%22%2C%22mermaid%22%3A%22%2Flib%2Fmermaid%2Fmermaid.min%22%2C%22json.sortify%22%3A%22%2Fcomponents%2Fjson.sortify%2Fdist%2FJSON.sortify%22%2C%22cm%22%3A%22%2Fcomponents%2Fcodemirror%22%2C%22tui-code-snippet%22%3A%22%2Flib%2Fcalendar%2Ftui-code-snippet.min%22%2C%22tui-date-picker%22%3A%22%2Flib%2Fcalendar%2Fdate-picker%22%2C%22netflux-client%22%3A%22%2Fcomponents%2Fnetflux-websocket%2Fnetflux-client%22%2C%22chainpad-netflux%22%3A%22%2Fcomponents%2Fchainpad-netflux%2Fchainpad-netflux%22%2C%22chainpad-listmap%22%3A%22%2Fcomponents%2Fchainpad-listmap%2Fchainpad-listmap%22%2C%22cm-extra%22%3A%22%2Flib%2Fcodemirror-extra-modes%22%2C%22asciidoctor%22%3A%22%2Flib%2Fasciidoctor%2Fasciidoctor.min%22%7D%2C%22map%22%3A%7B%22*%22%3A%7B%22css%22%3A%22%2Fcomponents%2Frequire-css%2Fcss.js%22%2C%22less%22%3A%22%2Fcommon%2FRequireLess.js%22%2C%22%2Fbower_components%2Ftweetnacl%2Fnacl-fast.min.js%22%3A%22%2Fcomponents%2Ftweetnacl%2Fnacl-fast.min.js%22%7D%7D%2C%22waitSeconds%22%3A600%2C%22urlArgs%22%3A%22ver%3D2024.3.0-1721738067427-1721738430785%22%7D%2C%22req%22%3A%5B%22%2Fcommon%2Floading.js%22%5D%2C%22pfx%22%3A%22http%3A%2F%2Flocalhost%3A3000%22%2C%22themeOS%22%3A%22light%22%2C%22lang%22%3A%22en%22%2C%22time%22%3A1721738430473%7D" allowfullscreen="true" allow="clipboard-write">``` 
       - Fix any of the following:  Element has no title attribute  aria-label attribute does not exist or is empty  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty  Element's default semantics were not overridden with role="none" or role="presentation" 
      - Severity: serious 

 - ### Issue 1 
 - Description: Ensures every HTML document has a lang attribute 
 - Help:  <html> element must have a lang attribute 
 - Help URL:  https://dequeuniversity.com/rules/axe/4.9/html-has-lang?application=playwright 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <html>``` 
       - Fix any of the following:  The <html> element does not have a lang attribute 
      - Severity: serious 

 - ### Issue 2 
 - Description: Ensures all page content is contained by landmarks 
 - Help:  All page content should be contained by landmarks 
 - Help URL:  https://dequeuniversity.com/rules/axe/4.9/region?application=playwright 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <div id="placeholder"><div class="placeholder-logo-container" style="opacity: 100;"><img class="placeholder-logo" alt="CryptPad Logo" src="/customize/CryptPad_logo.svg"></div><div class="placeholder-message-container" style="opacity: 100;"><p>Loading...</p></div></div>``` 
       - Fix any of the following:  Some page content is not contained by landmarks 
      - Severity: moderate 

 ## Teams 

 - ### Issue 0 
 - Description: Ensures iframe and frame elements have an accessible name 
 - Help:  Frames must have an accessible name 
 - Help URL:  https://dequeuniversity.com/rules/axe/4.9/frame-title?application=playwright 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <iframe id="sbox-iframe" src="http://localhost:3001/teams/inner.html?ver=2024.3.0-1721738067427-1721738462861#%7B%22cfg%22%3A%7B%22baseUrl%22%3A%22%2Fteams%2F%22%2C%22paths%22%3A%7B%22text%22%3A%22%2Fcomponents%2Frequirejs-plugins%2Flib%2Ftext%22%2C%22json%22%3A%22%2Fcomponents%2Frequirejs-plugins%2Fsrc%2Fjson%22%2C%22optional%22%3A%22%2Flib%2Foptional%2Foptional%22%2C%22jquery%22%3A%22%2Fcomponents%2Fjquery%2Fdist%2Fjquery.min%22%2C%22mermaid%22%3A%22%2Flib%2Fmermaid%2Fmermaid.min%22%2C%22json.sortify%22%3A%22%2Fcomponents%2Fjson.sortify%2Fdist%2FJSON.sortify%22%2C%22cm%22%3A%22%2Fcomponents%2Fcodemirror%22%2C%22tui-code-snippet%22%3A%22%2Flib%2Fcalendar%2Ftui-code-snippet.min%22%2C%22tui-date-picker%22%3A%22%2Flib%2Fcalendar%2Fdate-picker%22%2C%22netflux-client%22%3A%22%2Fcomponents%2Fnetflux-websocket%2Fnetflux-client%22%2C%22chainpad-netflux%22%3A%22%2Fcomponents%2Fchainpad-netflux%2Fchainpad-netflux%22%2C%22chainpad-listmap%22%3A%22%2Fcomponents%2Fchainpad-listmap%2Fchainpad-listmap%22%2C%22cm-extra%22%3A%22%2Flib%2Fcodemirror-extra-modes%22%2C%22asciidoctor%22%3A%22%2Flib%2Fasciidoctor%2Fasciidoctor.min%22%7D%2C%22map%22%3A%7B%22*%22%3A%7B%22css%22%3A%22%2Fcomponents%2Frequire-css%2Fcss.js%22%2C%22less%22%3A%22%2Fcommon%2FRequireLess.js%22%2C%22%2Fbower_components%2Ftweetnacl%2Fnacl-fast.min.js%22%3A%22%2Fcomponents%2Ftweetnacl%2Fnacl-fast.min.js%22%7D%7D%2C%22waitSeconds%22%3A600%2C%22urlArgs%22%3A%22ver%3D2024.3.0-1721738067427-1721738462861%22%7D%2C%22req%22%3A%5B%22%2Fcommon%2Floading.js%22%5D%2C%22pfx%22%3A%22http%3A%2F%2Flocalhost%3A3000%22%2C%22themeOS%22%3A%22light%22%2C%22lang%22%3A%22en%22%2C%22time%22%3A1721738462704%7D" allowfullscreen="true" allow="clipboard-write">``` 
       - Fix any of the following:  Element has no title attribute  aria-label attribute does not exist or is empty  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty  Element's default semantics were not overridden with role="none" or role="presentation" 
      - Severity: serious 

 - ### Issue 1 
 - Description: Ensures every HTML document has a lang attribute 
 - Help:  <html> element must have a lang attribute 
 - Help URL:  https://dequeuniversity.com/rules/axe/4.9/html-has-lang?application=playwright 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <html>``` 
       - Fix any of the following:  The <html> element does not have a lang attribute 
      - Severity: serious 

 - ### Issue 2 
 - Description: Ensures all page content is contained by landmarks 
 - Help:  All page content should be contained by landmarks 
 - Help URL:  https://dequeuniversity.com/rules/axe/4.9/region?application=playwright 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <div id="placeholder"><div class="placeholder-logo-container" style="opacity: 100;"><img class="placeholder-logo" alt="CryptPad Logo" src="/customize/CryptPad_logo.svg"></div><div class="placeholder-message-container" style="opacity: 100;"><p>Loading...</p></div></div>``` 
       - Fix any of the following:  Some page content is not contained by landmarks 
      - Severity: moderate 

 ## Teams (admin) 

 - ### Issue 0 
 - Description: Ensures iframe and frame elements have an accessible name 
 - Help:  Frames must have an accessible name 
 - Help URL:  https://dequeuniversity.com/rules/axe/4.9/frame-title?application=playwright 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <iframe id="sbox-iframe" src="http://localhost:3001/teams/inner.html?ver=2024.3.0-1721738067427-1721738501584#%7B%22cfg%22%3A%7B%22baseUrl%22%3A%22%2Fteams%2F%22%2C%22paths%22%3A%7B%22text%22%3A%22%2Fcomponents%2Frequirejs-plugins%2Flib%2Ftext%22%2C%22json%22%3A%22%2Fcomponents%2Frequirejs-plugins%2Fsrc%2Fjson%22%2C%22optional%22%3A%22%2Flib%2Foptional%2Foptional%22%2C%22jquery%22%3A%22%2Fcomponents%2Fjquery%2Fdist%2Fjquery.min%22%2C%22mermaid%22%3A%22%2Flib%2Fmermaid%2Fmermaid.min%22%2C%22json.sortify%22%3A%22%2Fcomponents%2Fjson.sortify%2Fdist%2FJSON.sortify%22%2C%22cm%22%3A%22%2Fcomponents%2Fcodemirror%22%2C%22tui-code-snippet%22%3A%22%2Flib%2Fcalendar%2Ftui-code-snippet.min%22%2C%22tui-date-picker%22%3A%22%2Flib%2Fcalendar%2Fdate-picker%22%2C%22netflux-client%22%3A%22%2Fcomponents%2Fnetflux-websocket%2Fnetflux-client%22%2C%22chainpad-netflux%22%3A%22%2Fcomponents%2Fchainpad-netflux%2Fchainpad-netflux%22%2C%22chainpad-listmap%22%3A%22%2Fcomponents%2Fchainpad-listmap%2Fchainpad-listmap%22%2C%22cm-extra%22%3A%22%2Flib%2Fcodemirror-extra-modes%22%2C%22asciidoctor%22%3A%22%2Flib%2Fasciidoctor%2Fasciidoctor.min%22%7D%2C%22map%22%3A%7B%22*%22%3A%7B%22css%22%3A%22%2Fcomponents%2Frequire-css%2Fcss.js%22%2C%22less%22%3A%22%2Fcommon%2FRequireLess.js%22%2C%22%2Fbower_components%2Ftweetnacl%2Fnacl-fast.min.js%22%3A%22%2Fcomponents%2Ftweetnacl%2Fnacl-fast.min.js%22%7D%7D%2C%22waitSeconds%22%3A600%2C%22urlArgs%22%3A%22ver%3D2024.3.0-1721738067427-1721738501584%22%7D%2C%22req%22%3A%5B%22%2Fcommon%2Floading.js%22%5D%2C%22pfx%22%3A%22http%3A%2F%2Flocalhost%3A3000%22%2C%22themeOS%22%3A%22light%22%2C%22lang%22%3A%22en%22%2C%22time%22%3A1721738501220%7D" allowfullscreen="true" allow="clipboard-write">``` 
       - Fix any of the following:  Element has no title attribute  aria-label attribute does not exist or is empty  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty  Element's default semantics were not overridden with role="none" or role="presentation" 
      - Severity: serious 

 - ### Issue 1 
 - Description: Ensures every HTML document has a lang attribute 
 - Help:  <html> element must have a lang attribute 
 - Help URL:  https://dequeuniversity.com/rules/axe/4.9/html-has-lang?application=playwright 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <html>``` 
       - Fix any of the following:  The <html> element does not have a lang attribute 
      - Severity: serious 

 - ### Issue 2 
 - Description: Ensures all page content is contained by landmarks 
 - Help:  All page content should be contained by landmarks 
 - Help URL:  https://dequeuniversity.com/rules/axe/4.9/region?application=playwright 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <div id="placeholder"><div class="placeholder-logo-container" style="opacity: 100;"><img class="placeholder-logo" alt="CryptPad Logo" src="/customize/CryptPad_logo.svg"></div><div class="placeholder-message-container" style="opacity: 100;"><p>Loading...</p></div></div>``` 
       - Fix any of the following:  Some page content is not contained by landmarks 
      - Severity: moderate 
