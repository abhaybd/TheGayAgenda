$(function () {
    chrome.storage.local.get("theme", function (obj) {
        let theme = obj.theme ?? "lgbt";
        $("#" + theme).prop("checked", true);

        $("#apply-button").on("click", function () {
            let theme = $("input[name=theme]:checked").val();
            chrome.storage.local.set({"theme": theme});
            console.log("New theme: " + theme);
        });
    });
})