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

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if ("theme" in changes) {
        setTheme(changes.theme.newValue, changes.theme.oldValue);
    }
});

$(function () {
    $("[aria-label=Calendar]").first().children().last().text("The Gay Agenda");

    chrome.storage.local.get("theme", function (obj) {
        setTheme(obj.theme ?? "lgbt");
    });

    setTimeout( function () {
        $("header#gb :not(.gb_Ca *, [role=menu] *, [aria-label=\"Account Information\"] *, :has(*))")
            .addClass("header-text");
        $("header#gb div.BXL82c").addClass("header-text");
        $("header#gb svg:not([aria-label=\"Account Information\"] *, #aso_search_form_anchor *)").addClass("header-svg");
    }, 500);
})
