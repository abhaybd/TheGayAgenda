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

function isColor(hexCode) {
    return /^#([0-9A-F]{3}){1,2}$/.test(hexCode);
}

$(function () {
    const inputTemplate = $("#custom-fields-template").remove().clone();
    inputTemplate.removeAttr("id");

    function numInputs() {
        return $("#custom-color-inputs").children().length;
    }

    function removeInput() {
        if (numInputs() > 2) {
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
        return inserted;
    }

    function notify(message, duration=1500) {
        const notification = $("<div>").text(message).prop("hidden", true);
        $("#notifications").append(notification);
        notification.slideDown(400, () => setTimeout(() => notification.slideUp(), duration));
    }

    chrome.storage.local.get("theme", function (obj) {
        let theme = obj.theme ?? "lgbt";
        const elem = $("#" + theme);
        elem.prop("checked", true);

        chrome.storage.local.get("custom_colors", function(obj) {
            if (obj.custom_colors) {
                $("#custom-color-inputs").empty();
                const colors = obj.custom_colors;
                for (let color of colors) {
                    let input = addColorInput(false);
                    input.find(".color-input").first().val(color).trigger("input");
                }
            }
            elem.trigger("change");
        });

        $("#apply-button").on("click", function () {
            let theme = $("input[name=theme]:checked").val();
            chrome.storage.local.set({"theme": theme});
            console.log("New theme: " + theme);
            if (theme === "custom") {
                let colors = $("input.color-input").map((i,e) => $(e).val());
                let colorList = [];
                for (let i = 0; i < colors.length; i++) {
                    let color = colors[i];
                    // default color is black
                    if (color.length === 0) {
                        color = "#000000";
                    }
                    if (isColor(color)) {
                        colorList.push(color);
                    } else {
                        notify("Invalid format for custom color!");
                        return;
                    }
                }
                console.log("Custom color list: " + colorList);
                chrome.storage.local.set({"custom_colors": colorList});
            }
            notify("Successfully applied new theme!");
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

        // update the cursor position
        elem.setCursorPos(cursorPos);

        // set the color of the color preview
        let color = value.length === 0 ? "#000000" : value;
        color = isColor(color) ? color : "transparent";
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
                addColorInput(false);
            }
            elem.slideDown();
        } else {
            elem.slideUp();
        }
        console.log("Changed!");
    });
})
