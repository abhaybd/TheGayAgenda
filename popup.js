// shamelessly copied from stack overflow
$.fn.setCursorPos = function(pos) {
    return this.each(function() {
        if('selectionStart' in this) {
            this.selectionStart = pos;
            this.selectionEnd = pos;
        } else if(this.setSelectionRange) {
            this.setSelectionRange(pos, pos);
        } else if(this.createTextRange) {
            const range = this.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    });
};

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
            // TODO: add code to handle custom theme
            let theme = $("input[name=theme]:checked").val();
            chrome.storage.local.set({"theme": theme});
            console.log("New theme: " + theme);
        });
    });

    $(document).on("input", ".color-input", function (e) {
        const elem = $(this);
        const rawVal = elem.val();
        let value = rawVal.toUpperCase();
        let cursorPos = e.target.selectionStart;

        value = value.replaceAll(/[^0-9A-F]/g, "");
        if (value.length > 0 && !value.startsWith("#")) {
            // we added a character when there previously was none, so the cursor should advance by one extra
            if (!rawVal.startsWith("#")) {
                cursorPos++;
            }
            value = "#" + value;
        }
        value = value.substring(0, Math.min(value.length, 7));

        // update the element attributes
        elem.val(value);
        elem.attr("data-prev-val", value);

        // update the cursor position
        elem.setCursorPos(cursorPos);

        // set the color of the color preview
        let color = value.length === 0 ? "#000000" : value;
        color = /^#([0-9A-F]{3}){1,2}$/.test(color) ? color : "transparent";
        elem.siblings(".color-preview").css("background", color);
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
