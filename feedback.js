
function openFeedbackModal() {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSc2wK_1qz8x6DvJuOqj9LNx3HUe2NoL4i6R-69019F0Uj9EyA/viewform", "_blank");
}

document.addEventListener("DOMContentLoaded", function() {
    const button = document.createElement("button");
    button.id = "feedbackButton";
    button.innerHTML = '<i class="far fa-comment-alt"></i>';
    button.onclick = openFeedbackModal;

    const iconStyle = document.createElement("style");
    iconStyle.innerHTML = `
        #feedbackButton .icon {
            font-size: 7px;
            width: 13px;
            height: 13px;
        }
    `;
    document.head.appendChild(iconStyle);

    const buttonStyle = document.createElement("style");
    buttonStyle.innerHTML = `
        #feedbackButton {
            position: absolute;
            top: 18%;
            left: 92%;
            transform: translateX(-50%);
            background-color: white;
            border: 2px solid #2b13bb;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 33px;
            height: 33px;
            z-index: 1000;
            padding: 10px;
        }

        #feedbackButton::after {
            content: "FEEDBACK";
             position: absolute;
            right: calc(100% + 5px); 
            transform: translatey(-50%)
             top: 70%;
            background-color: black;
            color: white;
            border: 1px solid;
            padding: 5px;
            border-radius: 5px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 999;
            display: none;
        }

        #feedbackButton:hover::after {
            display: block;
        }

        @media only screen and (min-width: 601px) and (max-width: 900px) {
        #feedbackButton {
        top: 18%;
        left: 96%;
        width: 32px;
        height: 30px;
        padding: 8px;
        }

     #feedbackButton::after {
        font-size: 11px;
        padding: 4px;
        top: 60%;
        right: calc(100% + 3px);
        }
    }

    @media only screen and (min-width: 601px) and (max-width: 900px) {
        #feedbackButton {
        top: 18%;
        left: 96%;
        width: 32px;
        height: 30px;
        padding: 8px;
        }

     #feedbackButton::after {
        font-size: 11px;
        padding: 4px;
        top: 60%;
        right: calc(100% + 3px);
        }
    }

    @media only screen and (min-width: 901px) and (max-width: 1200px) {
        #feedbackButton {
        top: 18%;
        left: 97%;
        width: 32px;
        }

     #feedbackButton::after {
        font-size: 11px;
        padding: 4px;
        top: 60%;
        right: calc(100% + 3px);
        }
    }


@media only screen and (min-width: 1201px) {
#feedbackButton {
        top: 18%;
        left: 98%;
        width: 32px;
        }

     #feedbackButton::after {
        font-size: 11px;
        padding: 4px;
        top: 60%;
        right: calc(100% + 3px);
        }
}

@media only screen and (min-width: 1440px) {
#feedbackButton {
        top: 16%;
        left: 98.3%;
        width: 32px;
        }

     #feedbackButton::after {
        font-size: 11px;
        padding: 4px;
        top: 60%;
        right: calc(100% + 3px);
        }
}
    `;
    document.head.appendChild(buttonStyle);

    document.body.appendChild(button);
});
