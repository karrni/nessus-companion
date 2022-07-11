// ==UserScript==
// @name         Nessus Companion
// @namespace    https://github.com/karrni
// @version      1.0
// @description  Making Nessus less frustrating :3
// @author       Karrni
// @match        https://nessus.pen.test
// @grant        GM_setClipboard
// @run-at       document-end
// ==/UserScript==


function copyHostsHandler() {
    const selector = "a:not(.copy-button";

    let hosts = [];
    this.parentNode.querySelectorAll(selector).forEach(n => {
        hosts.push(n.dataset.hostId);
    });

    GM_setClipboard(hosts.join("\n"));
}

function addHostsCopyButton(target) {
    const hostsWrapper = target.parentNode;
    hostsWrapper.style = "display: flex;";
    target.style = "flex-grow: 1;";

    const copyButton = document.createElement("a");
    copyButton.className = "copy-button";
    copyButton.href = "#";
    copyButton.type = "button";
    copyButton.innerText = "copy";
    copyButton.onclick = copyHostsHandler;

    hostsWrapper.appendChild(copyButton);
}

(function() {
    'use strict';

    const observer = new MutationObserver(function (mutations, mutationInstance) {
        for (const mutation of mutations) {
            if (mutation.target.className == "hosts-wrapper-hosts") {
                addHostsCopyButton(mutation.target);
            }
        }
    });

    observer.observe(document, {subtree: true, childList: true});
})();
