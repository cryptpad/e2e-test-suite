
 # CryptPad 
 ## Contact 

 - ### Issue 0 
 - Description: Ensures every HTML document has a lang attribute 
 - Help:  <html> element must have a lang attribute 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <html id="four-oh-four">``` 
       - Fix any of the following:  The <html> element does not have a lang attribute 
      - Severity: serious 

 - ### Issue 1 
 - Description: Ensures the document has a main landmark 
 - Help:  Document should have one main landmark 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <html id="four-oh-four">``` 
       - Fix all of the following:  Document does not have a main landmark 
      - Severity: moderate 

 - ### Issue 2 
 - Description: Ensures <meta name="viewport"> does not disable text scaling and zooming 
 - Help:  Zooming and scaling must not be disabled 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">``` 
       - Fix any of the following:  user-scalable=no on <meta> tag disables zooming on mobile devices 
      - Severity: critical 

 - ### Issue 3 
 - Description: Ensure that the page, or at least one of its frames contains a level-one heading 
 - Help:  Page should contain a level-one heading 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <html id="four-oh-four">``` 
       - Fix all of the following:  Page must have a level-one heading 
      - Severity: moderate 

 # Documentation 

 - ### Issue 0 
 - Description: Ensures <iframe> and <frame> elements have an accessible name 
 - Help:  Frames must have an accessible name 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <iframe id="sbox-iframe" src="http://localhost:3001/diagram/inner.html?ver=2024.3.0-1721129308075-1721145913559#%7B%22cfg%22%3A%7B%22baseUrl%22%3A%22%2Fdiagram%2F%22%2C%22paths%22%3A%7B%22text%22%3A%22%2Fcomponents%2Frequirejs-plugins%2Flib%2Ftext%22%2C%22json%22%3A%22%2Fcomponents%2Frequirejs-plugins%2Fsrc%2Fjson%22%2C%22optional%22%3A%22%2Flib%2Foptional%2Foptional%22%2C%22jquery%22%3A%22%2Fcomponents%2Fjquery%2Fdist%2Fjquery.min%22%2C%22mermaid%22%3A%22%2Flib%2Fmermaid%2Fmermaid.min%22%2C%22json.sortify%22%3A%22%2Fcomponents%2Fjson.sortify%2Fdist%2FJSON.sortify%22%2C%22cm%22%3A%22%2Fcomponents%2Fcodemirror%22%2C%22tui-code-snippet%22%3A%22%2Flib%2Fcalendar%2Ftui-code-snippet.min%22%2C%22tui-date-picker%22%3A%22%2Flib%2Fcalendar%2Fdate-picker%22%2C%22netflux-client%22%3A%22%2Fcomponents%2Fnetflux-websocket%2Fnetflux-client%22%2C%22chainpad-netflux%22%3A%22%2Fcomponents%2Fchainpad-netflux%2Fchainpad-netflux%22%2C%22chainpad-listmap%22%3A%22%2Fcomponents%2Fchainpad-listmap%2Fchainpad-listmap%22%2C%22cm-extra%22%3A%22%2Flib%2Fcodemirror-extra-modes%22%2C%22asciidoctor%22%3A%22%2Flib%2Fasciidoctor%2Fasciidoctor.min%22%7D%2C%22map%22%3A%7B%22*%22%3A%7B%22css%22%3A%22%2Fcomponents%2Frequire-css%2Fcss.js%22%2C%22less%22%3A%22%2Fcommon%2FRequireLess.js%22%2C%22%2Fbower_components%2Ftweetnacl%2Fnacl-fast.min.js%22%3A%22%2Fcomponents%2Ftweetnacl%2Fnacl-fast.min.js%22%7D%7D%2C%22waitSeconds%22%3A600%2C%22urlArgs%22%3A%22ver%3D2024.3.0-1721129308075-1721145913559%22%7D%2C%22req%22%3A%5B%22%2Fcommon%2Floading.js%22%5D%2C%22pfx%22%3A%22http%3A%2F%2Flocalhost%3A3000%22%2C%22themeOS%22%3A%22light%22%2C%22lang%22%3A%22en%22%2C%22time%22%3A1721145912119%7D" allowfullscreen="true" allow="clipboard-write">``` 
       - Fix any of the following:  Element has no title attribute  aria-label attribute does not exist or is empty  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty  Element's default semantics were not overridden with role="none" or role="presentation" 
      - Severity: serious 

 - ### Issue 1 
 - Description: Ensures every HTML document has a lang attribute 
 - Help:  <html> element must have a lang attribute 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <html>``` 
       - Fix any of the following:  The <html> element does not have a lang attribute 
      - Severity: serious 

 - ### Issue 2 
 - Description: Ensures all page content is contained by landmarks 
 - Help:  All page content should be contained by landmarks 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <div id="placeholder"><div class="placeholder-logo-container" style="opacity: 100;"><img class="placeholder-logo" alt="CryptPad Logo" src="/customize/CryptPad_logo.svg"></div><div class="placeholder-message-container" style="opacity: 100;"><p>Loading...</p></div></div>``` 
       - Fix any of the following:  Some page content is not contained by landmarks 
      - Severity: moderate 

 # Documentation 

 - ### Issue 0 
 - Description: Ensures <iframe> and <frame> elements have an accessible name 
 - Help:  Frames must have an accessible name 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <iframe id="sbox-iframe" src="http://localhost:3001/whiteboard/inner.html?ver=2024.3.0-1721129308075-1721145940826#%7B%22cfg%22%3A%7B%22baseUrl%22%3A%22%2Fwhiteboard%2F%22%2C%22paths%22%3A%7B%22text%22%3A%22%2Fcomponents%2Frequirejs-plugins%2Flib%2Ftext%22%2C%22json%22%3A%22%2Fcomponents%2Frequirejs-plugins%2Fsrc%2Fjson%22%2C%22optional%22%3A%22%2Flib%2Foptional%2Foptional%22%2C%22jquery%22%3A%22%2Fcomponents%2Fjquery%2Fdist%2Fjquery.min%22%2C%22mermaid%22%3A%22%2Flib%2Fmermaid%2Fmermaid.min%22%2C%22json.sortify%22%3A%22%2Fcomponents%2Fjson.sortify%2Fdist%2FJSON.sortify%22%2C%22cm%22%3A%22%2Fcomponents%2Fcodemirror%22%2C%22tui-code-snippet%22%3A%22%2Flib%2Fcalendar%2Ftui-code-snippet.min%22%2C%22tui-date-picker%22%3A%22%2Flib%2Fcalendar%2Fdate-picker%22%2C%22netflux-client%22%3A%22%2Fcomponents%2Fnetflux-websocket%2Fnetflux-client%22%2C%22chainpad-netflux%22%3A%22%2Fcomponents%2Fchainpad-netflux%2Fchainpad-netflux%22%2C%22chainpad-listmap%22%3A%22%2Fcomponents%2Fchainpad-listmap%2Fchainpad-listmap%22%2C%22cm-extra%22%3A%22%2Flib%2Fcodemirror-extra-modes%22%2C%22asciidoctor%22%3A%22%2Flib%2Fasciidoctor%2Fasciidoctor.min%22%7D%2C%22map%22%3A%7B%22*%22%3A%7B%22css%22%3A%22%2Fcomponents%2Frequire-css%2Fcss.js%22%2C%22less%22%3A%22%2Fcommon%2FRequireLess.js%22%2C%22%2Fbower_components%2Ftweetnacl%2Fnacl-fast.min.js%22%3A%22%2Fcomponents%2Ftweetnacl%2Fnacl-fast.min.js%22%7D%7D%2C%22waitSeconds%22%3A600%2C%22urlArgs%22%3A%22ver%3D2024.3.0-1721129308075-1721145940826%22%7D%2C%22req%22%3A%5B%22%2Fcommon%2Floading.js%22%5D%2C%22pfx%22%3A%22http%3A%2F%2Flocalhost%3A3000%22%2C%22themeOS%22%3A%22light%22%2C%22lang%22%3A%22en%22%2C%22time%22%3A1721145939593%7D" allowfullscreen="true" allow="clipboard-write">``` 
       - Fix any of the following:  Element has no title attribute  aria-label attribute does not exist or is empty  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty  Element's default semantics were not overridden with role="none" or role="presentation" 
      - Severity: serious 

 - ### Issue 1 
 - Description: Ensures every HTML document has a lang attribute 
 - Help:  <html> element must have a lang attribute 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <html>``` 
       - Fix any of the following:  The <html> element does not have a lang attribute 
      - Severity: serious 

 - ### Issue 2 
 - Description: Ensures all page content is contained by landmarks 
 - Help:  All page content should be contained by landmarks 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <div id="placeholder"><div class="placeholder-logo-container" style="opacity: 100;"><img class="placeholder-logo" alt="CryptPad Logo" src="/customize/CryptPad_logo.svg"></div><div class="placeholder-message-container" style="opacity: 100;"><p>Loading...</p></div></div>``` 
       - Fix any of the following:  Some page content is not contained by landmarks 
      - Severity: moderate 

 # Documentation 

 - ### Issue 0 
 - Description: Ensures the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds 
 - Help:  Elements must meet minimum color contrast ratio thresholds 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <a href="#">Index</a>``` 
       - Fix any of the following:  Element has insufficient color contrast of 3.2 (foreground color: #0087ff, background color: #f3f3f3, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1 
      - Severity: serious 
   - Node 1 
      - HTML: ``` <a class="reference internal" href="FAQ.html">Frequently Asked Questions</a>``` 
       - Fix any of the following:  Element has insufficient color contrast of 3.46 (foreground color: #0087ff, background color: #fcfcfc, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1 
      - Severity: serious 
   - Node 2 
      - HTML: ``` <a class="reference internal" href="how_to_contribute.html">How to contribute</a>``` 
       - Fix any of the following:  Element has insufficient color contrast of 3.46 (foreground color: #0087ff, background color: #fcfcfc, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1 
      - Severity: serious 
   - Node 3 
      - HTML: ``` <footer>``` 
       - Fix any of the following:  Element has insufficient color contrast of 3.84 (foreground color: #808080, background color: #fcfcfc, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1 
      - Severity: serious 
   - Node 4 
      - HTML: ``` <p>        © Copyright 2024, CryptPad Team.    </p>``` 
       - Fix any of the following:  Element has insufficient color contrast of 3.84 (foreground color: #808080, background color: #fcfcfc, font size: 13.2pt (17.6px), font weight: normal). Expected contrast ratio of 4.5:1 
      - Severity: serious 
   - Node 5 
      - HTML: ``` <a href="https://sphinx-doc.org/">Sphinx</a>``` 
       - Fix any of the following:  Element has insufficient color contrast of 3.46 (foreground color: #0087ff, background color: #fcfcfc, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1 
      - Severity: serious 
   - Node 6 
      - HTML: ``` <a href="https://github.com/rtfd/sphinx_rtd_theme">RTD theme</a>``` 
       - Fix any of the following:  Element has insufficient color contrast of 3.46 (foreground color: #0087ff, background color: #fcfcfc, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1 
      - Severity: serious 
   - Node 7 
      - HTML: ``` <a href="https://cryptpad.fr" title="CryptPad flagship instance">CryptPad flagship instance</a>``` 
       - Fix any of the following:  Element has insufficient color contrast of 3.46 (foreground color: #0087ff, background color: #fcfcfc, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1 
      - Severity: serious 
   - Node 8 
      - HTML: ``` <a href="https://github.com/cryptpad/documentation" title="The GitHub repository">GitHub repository for this documentation</a>``` 
       - Fix any of the following:  Element has insufficient color contrast of 3.46 (foreground color: #0087ff, background color: #fcfcfc, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1 
      - Severity: serious 

 - ### Issue 1 
 - Description: Ensures <img> elements have alternate text or a role of none or presentation 
 - Help:  Images must have alternate text 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <img src="_static/images/source-code.png">``` 
       - Fix any of the following:  Element does not have an alt attribute  aria-label attribute does not exist or is empty  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty  Element has no title attribute  Element's default semantics were not overridden with role="none" or role="presentation" 
      - Severity: critical 

 - ### Issue 2 
 - Description: Ensure links are distinguished from surrounding text in a way that does not rely on color 
 - Help:  Links must be distinguishable without relying on color 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <a href="https://sphinx-doc.org/">Sphinx</a>``` 
       - Fix any of the following:  The link has insufficient color contrast of 1.11:1 with the surrounding text. (Minimum contrast is 3:1, link text: #0087ff, surrounding text: #808080)  The link has no styling (such as underline) to distinguish it from the surrounding text 
      - Severity: serious 
   - Node 1 
      - HTML: ``` <a href="https://github.com/rtfd/sphinx_rtd_theme">RTD theme</a>``` 
       - Fix any of the following:  The link has insufficient color contrast of 1.11:1 with the surrounding text. (Minimum contrast is 3:1, link text: #0087ff, surrounding text: #808080)  The link has no styling (such as underline) to distinguish it from the surrounding text 
      - Severity: serious 

 - ### Issue 3 
 - Description: Ensures links have discernible text 
 - Help:  Links must have discernible text 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <a href="_sources/index.rst.txt" rel="nofollow">                            <img src="_static/images/source-code.png">             <!-- View page source -->          </a>``` 
       - Fix all of the following:  Element is in tab order and does not have accessible textFix any of the following:  Element does not have text that is visible to screen readers  aria-label attribute does not exist or is empty  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty  Element has no title attribute 
      - Severity: serious 

 - ### Issue 4 
 - Description: Ensures all page content is contained by landmarks 
 - Help:  All page content should be contained by landmarks 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <footer>``` 
       - Fix any of the following:  Some page content is not contained by landmarks 
      - Severity: moderate 

 - ### Issue 5 
 - Description: Ensures select element has an accessible name 
 - Help:  Select element must have an accessible name 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <select id="language-selector-container">``` 
       - Fix any of the following:  Form element does not have an implicit (wrapped) <label>  Form element does not have an explicit <label>  aria-label attribute does not exist or is empty  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty  Element has no title attribute  Element's default semantics were not overridden with role="none" or role="presentation" 
      - Severity: critical 

 # Project Website 

 - ### Issue 0 
 - Description: Ensures the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds 
 - Help:  Elements must meet minimum color contrast ratio thresholds 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <a href="https://opencollective.com/cryptpad/contribute" class="highlight">                    <i aria-hidden="true" class="fa fa-open-collective"></i>Donate on OpenCollective                </a>``` 
       - Fix any of the following:  Element has insufficient color contrast of 3.06 (foreground color: #0087ff, background color: #eeeeee, font size: 13.2pt (17.6px), font weight: normal). Expected contrast ratio of 4.5:1 
      - Severity: serious 
   - Node 1 
      - HTML: ``` <a href="/pricing/" class="highlight">                    <i aria-hidden="true" class="fa fa-ticket"></i>Pricing                </a>``` 
       - Fix any of the following:  Element has insufficient color contrast of 3.06 (foreground color: #0087ff, background color: #eeeeee, font size: 13.2pt (17.6px), font weight: normal). Expected contrast ratio of 4.5:1 
      - Severity: serious 

 - ### Issue 1 
 - Description: Ensures the document has a main landmark 
 - Help:  Document should have one main landmark 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <html lang="en">``` 
       - Fix all of the following:  Document does not have a main landmark 
      - Severity: moderate 

 - ### Issue 2 
 - Description: Ensures all page content is contained by landmarks 
 - Help:  All page content should be contained by landmarks 
 - Affected nodes: 
   - Node 0 
      - HTML: ``` <section id="intro">``` 
       - Fix any of the following:  Some page content is not contained by landmarks 
      - Severity: moderate 
   - Node 1 
      - HTML: ``` <section id="try-cryptpad">    <p>CryptPad is a collaborative office suite that is end-to-end encrypted and open-source.</p>    <a class="fake-button" href="/instances/">Try CryptPad <i class="fa fa-arrow-right"></i></a></section>``` 
       - Fix any of the following:  Some page content is not contained by landmarks 
      - Severity: moderate 
   - Node 2 
      - HTML: ``` <section class="features">``` 
       - Fix any of the following:  Some page content is not contained by landmarks 
      - Severity: moderate 
   - Node 3 
      - HTML: ``` <h2><a href="#testimonials">Testimonials</a></h2>``` 
       - Fix any of the following:  Some page content is not contained by landmarks 
      - Severity: moderate 
   - Node 4 
      - HTML: ``` <p>We asked users what they love about CryptPad.<br>        <a href="https://cryptpad.fr/form/#/2/form/view/1NDX7MEkhzNz1FCrcjCxmvjgIj24QjWNncZygR60Ch8/">Submit a testimonial</a>    </p>``` 
       - Fix any of the following:  Some page content is not contained by landmarks 
      - Severity: moderate 
   - Node 5 
      - HTML: ``` <p><a href="/testimonials/">See all 497 Testimonials</a></p>``` 
       - Fix any of the following:  Some page content is not contained by landmarks 
      - Severity: moderate 
