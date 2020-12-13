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

chrome.storage.onChanged.addListener(function (changes) {
    if ("theme" in changes) {
        setTheme(changes.theme.newValue, changes.theme.oldValue);
    }
});

$(function () {
    $("[aria-label=Calendar]").first().children().last().text("The Gay Agenda");

    chrome.storage.local.get("theme", function (obj) {
        setTheme(obj.theme ?? "lgbt");
    });
})
