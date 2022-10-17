// ==UserScript==
// @name         Nessus Companion
// @namespace    https://github.com/karrni
// @version      1.0
// @description  Making Nessus less frustrating :3
// @author       Karrni
// @match        https://nessus:8834/
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end
// ==/UserScript==


// --- Copy Hosts ---

function parseHostsFromRow(row) {
    const portString = row.querySelector(".port > span").innerText;
    port = portString.split(" / ")[0];

    const hosts = [];
    row.querySelectorAll(".hosts-wrapper-hosts > a").forEach(n => {
        hosts.push(n.dataset.hostId + ':' + port);
    });

    return hosts;
}

function copyHostsButtonHandler() {
    const row = this.parentNode.parentNode.parentNode;

    const hosts = parseHostsFromRow(row);
    GM_setClipboard(hosts.join("\n"));
}

// Add copy button to each output table row
function addCopyHostsButton(target) {
    const wrapper = target.parentNode;

    wrapper.style = "display: flex";
    target.style = "flex-grow: 1";

    const copyButton = document.createElement("a");
    copyButton.href = "#";
    copyButton.className = "copy-hosts";
    copyButton.onclick = copyHostsButtonHandler;

    wrapper.appendChild(copyButton);
}


// --- Sort Folders ---

var foldersSorted = false;

function sortFolders() {
    if (!foldersSorted) {
        const folderList = document.querySelector("#sidenav div[data-name='Folders']");

        for (let i = 1; i < folderList.childNodes.length; i++) {
            folderList.insertBefore(folderList.childNodes[i], folderList.firstChild);
        }

        foldersSorted = true;
    }
}


// --- Main ---

function addStyles() {
    // Copy Hosts
    GM_addStyle(".copy-hosts {margin: 0 .5em 0 1em; color: #FFF;}")
    GM_addStyle(".copy-hosts:hover, .copy-hosts:focus, .copy-hosts:active {color: inherit; text-decoration: none;}")
    GM_addStyle(".copy-hosts:before {content: '\\F0C5'; font-family: FontAwesome}");
}

(function() {
    'use strict';

    const location = window.location.hash;

    // Regexes to match certain subpages
    const pluginDetailsPageRegex = /^#\/scans\/reports\/\d+\/vulnerabilities\/\d+$/;

    addStyles();

    const observer = new MutationObserver(function (mutations, mutationInstance) {
        for (const mutation of mutations) {
            const target = mutation.target;

            // Sort Folders
            if (target.getAttribute("role") === "navigation" &&
                target.parentNode.id === "sidenav") {
                sortFolders();
            }

            // Plugin Details Page
            if (location.match(pluginDetailsPageRegex)) {
                if (target.className === "hosts-wrapper-hosts") {
                    addCopyHostsButton(target);
                }
            }
        }
    });

    observer.observe(document, {subtree: true, childList: true});
})();
