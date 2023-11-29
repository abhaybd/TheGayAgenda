function setTheme(theme, oldTheme = undefined) {
    let header = $("header#gb");
    if (oldTheme) {
        let className = "theme-" + oldTheme;
        header.removeClass(className);
    }
    let className = "theme-" + theme;
    console.log("Setting theme: " + className);
    header.addClass(className);
}

function defineCustomStyle(colors) {
    let elem = $("style#tga-custom-style");
    if (elem.length === 0) {
        elem = $("<style>");
        elem.attr("id", "tga-custom-style");
        elem.appendTo(document.head);
    }
    elem.text(`.theme-custom { background: linear-gradient(90deg, ${colors.join(", ")}); }`);
    console.log("Custom style added!");
}

chrome.storage.onChanged.addListener(function (changes) {
    if (changes.theme) {
        setTheme(changes.theme.newValue, changes.theme.oldValue);
    }
    if (changes.custom_colors) {
        defineCustomStyle(changes.custom_colors.newValue);
    }
});

$(function () {
    let elems = document.querySelectorAll("[aria-label='Calendar'] [role='heading']");
    for (const elem of elems) {
        elem.textContent = "The Gay Agenda";
    }

    chrome.storage.local.get("custom_colors", function (obj) {
        if (obj.custom_colors) {
            defineCustomStyle(obj.custom_colors);
        }
    });

    chrome.storage.local.get("theme", function (obj) {
        setTheme(obj.theme ?? "lgbt");
    });
})
