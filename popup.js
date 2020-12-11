$(function () {
    chrome.storage.local.get("theme", function (obj) {
        let theme = obj.theme;
        if (theme) {
            $("#" + theme).prop("checked", true);
        }

        $("#apply-button").on("click", function () {
            let theme = $("input[name=theme]:checked").val();
            chrome.storage.local.set({"theme": theme});
            console.log("New theme: " + theme);
            const notifElem = $("#notification");
            notifElem.slideDown();
            setTimeout(() => notifElem.slideUp(), 1500);
        });
    });
})