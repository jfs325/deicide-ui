import { codeToHtml } from "shiki";
import base64 from "base-64";

for (let ele of document.getElementsByClassName("sourcecode")) {
    let sourcecode = ele.getAttribute("data-sourcecode");
    let lang = ele.getAttribute("data-lang") || "java";
    let theme = ele.getAttribute("data-theme") || "github-light";

    if (sourcecode != null) {
        codeToHtml(base64.decode(sourcecode), {
            lang: lang,
            theme: theme
        }).then(html => ele.innerHTML = html);
    }
}
