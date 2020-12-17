$(function () {
    const inputTemplate = $("#custom-fields-template").remove().clone();
    inputTemplate.removeAttr("id");

    function numInputs() {
        return $("#custom-color-inputs").children().length;
    }

    function removeInput() {
        if (numInputs() !== 1) {
            $(this).parent().slideUp(400, function () {
                $(this).remove();
            });
        }
    }

    function addColorInput(slideDown = true) {
        const inserted = inputTemplate.clone();
        inserted.find(".delete-button").on("click", removeInput);
        $("#custom-color-inputs").append(inserted);
        if (slideDown) {
            inserted.slideDown();
        } else {
            inserted.removeAttr("hidden");
        }
    }

    chrome.storage.local.get("theme", function (obj) {
        let theme = obj.theme ?? "lgbt";
        $("#" + theme).prop("checked", true);

        $("#apply-button").on("click", function () {
            let theme = $("input[name=theme]:checked").val();
            chrome.storage.local.set({"theme": theme});
            console.log("New theme: " + theme);
        });
    });

    $(document).on("input", ".color-input", function () {
        const elem = $(this);
        let value = elem.val().toUpperCase();
        value = value.replaceAll(/[^A-F]/g, "");
        if (value.length > 0 && !value.startsWith("#")) {
            value = "#" + value;
        }
        value = value.substring(0, Math.min(value.length, 7));
        elem.val(value);
    });

    $("#add-color").on("click", function () {
        addColorInput();
    });

    $("input[type=radio][name=theme]").on("change", function () {
        const elem = $("#custom-colors");
        if (this.id === "custom") {
            if (numInputs() === 0) {
                addColorInput(false);
            }
            elem.slideDown();
        } else {
            elem.slideUp();
        }
        console.log("Changed!");
    });
})
