document.addEventListener("DOMContentLoaded", () => {
    main()
})

function main() {
    const params = new URLSearchParams(window.location.search)
    /**
     * Translation
     */
    const english = document.querySelector("textarea#english")
    const aurebesh = document.querySelector("textarea#aurebesh")

    if (params.has("text")) {
        english.value = aurebesh.value = params.get("text")
        if (english.value.toLowerCase() === "aurebesh" && !document.querySelector(".translateAurebesh i"))
            aurebeshEasterEgg()
    }

    english.addEventListener("keyup", (event) => {
        aurebesh.value = event.target.value
        if (event.target.value.toLowerCase() === "aurebesh" && !document.querySelector(".translateAurebesh i"))
            aurebeshEasterEgg()
    })

    aurebesh.addEventListener("keyup", (event) => {
        english.value = event.target.value
    })

    /** Toggle on-screen keyboard */
    function toggleKeyboard(element) {
        const classes = element.classList
        classes.toggle("active")
        document.querySelector(".simple-keyboard").classList.toggle("active")
        document.querySelector(".simple-keyboard").style.display = classes.contains("active") ? "block" : "none"
    }

    const keyboardIcon = document.querySelector(".translateArea i.fa-keyboard")
    if (params.has("keyboard"))
        toggleKeyboard(keyboardIcon)

    keyboardIcon.addEventListener("click", event => toggleKeyboard(event.target))

    /**
     * On-screen keyboard
     */
    const Keyboard = window.SimpleKeyboard.default
    const defaultLayouts = {
        default: [
            "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
            "{tab} q w e r t y u i o p [ ] \\",
            "{lock} a s d f g h j k l ; '",
            "{shift} z x c v b n m , . / {shift}",
            "{double} $ {space} @ {double}",
        ],
        shift: [
            "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
            "{tab} Q W E R T Y U I O P { } |",
            "{lock} A S D F G H J K L : \"",
            "{shift} Z X C V B N M < > ? {shift}",
            "{double} $ {space} @ {double}",
        ],
        double: [
            "{empty}",
            "{empty}",
            "{empty}",
            "{shiftDbl} ch ae eo kh ng oo sh th {bksp}",
            "{double} $ {space} @ {double}",
        ],
        shiftDbl: [
            
            "{empty}",
            "{empty}",
            "{empty}",
            "{shiftDbl} CH AE EO KH NG OO SH TH {bksp}",
            "{double} $ {space} @ {double}",
        ],
    }

    let keyboard = new Keyboard({
        onChange: input => onChange(input),
        onKeyPress: button => onKeyPress(button),
        theme: "hg-theme-default dark",
        layout: defaultLayouts,
        mergeDisplay: true,
        display: {
            "{enter}": "enter",
            "{lock}": "caps",
            "{shiftDbl}": "shift",
            "{space}": "space",
            "{double}": "double",
        },
        buttonTheme: [{
            class: "letter",
            buttons: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z a b c d e f g h i j k l m n o p q r s t u v w x y z"
        }]
    })

    // Change keyboard layout on mobile
    const mediaQuery = window.matchMedia("(max-width: 767px)")
    function mobileKeyboard(e) {
        if (e.matches) {
            keyboard.setOptions({
                layout: {
                    default: [
                        "q w e r t y u i o p {bksp}",
                        "a s d f g h j k l",
                        "{shift} z x c v b n m , . {shift}",
                        "{alt} {space} {double}",
                    ],
                    shift: [
                        "Q W E R T Y U I O P {bksp}",
                        "A S D F G H J K L",
                        "{shift} Z X C V B N M , . {shift}",
                        "{alt} {space} {double}",
                    ],
                    alt: [
                        "1 2 3 4 5 6 7 8 9 0 {bksp}",
                        "@ # $ & * ( ) '",
                        "{shift} % - + = / ; : ! ? {shift}",
                        "{alt} {space} {double}"
                    ],
                    double: [
                        "{shiftDbl} ch ae eo kh ng oo sh th {bksp}",
                        "{alt} {space} {double}",
                    ],
                    shiftDbl: [
                        "{shiftDbl} CH AE EO KH NG OO SH TH {bksp}",
                        "{alt} {space} {double}",
                    ],
                },
                mergeDisplay: true,
                display: {
                    "{bksp}": "⌫",
                    "{shiftDbl}": "shift",
                    "{space}": "space",
                    "{double}": "double",
                    "{alt}": ".?123",
                }
            })
        } else {
            keyboard.setOptions({
                layout: defaultLayouts
            })
        }
    }
    mobileKeyboard(mediaQuery)
    mediaQuery.addListener(mobileKeyboard)

    const inputField = document.querySelector("textarea#english")
    inputField.addEventListener("input", event => {
        if (event.isComposing || event.keyCode === 229)
            return
        keyboard.setInput(event.target.value)
    })

    function onChange(input) {
        inputField.value = aurebesh.value = input
    }

    function onKeyPress(button) {
        console.log("Button pressed", button)
        switch (button) {
            case "{shift}":
            case "{lock}":
                handleFunction("shift")
                break
            case "{double}":
                handleFunction("double")
                break
            case "{shiftDbl}":
                handleFunction("shiftDbl")
                break
            case "{alt}":
                handleFunction("alt")
                break
        }
    }

    function handleFunction(button) {
        const currentLayout = keyboard.options.layoutName
        const prevLayout = keyboard.options.prevLayout

        let newLayout
        if (currentLayout === "default")
            newLayout = button
        else if (currentLayout === button)
            if (["caps", "shift", "alt", "double"].includes(currentLayout))
                newLayout = "default"
            else
                newLayout = prevLayout
        else
            newLayout = button

        keyboard.setOptions({
            layoutName: newLayout,
            prevLayout: currentLayout
        })

        // console.log("Current layout", currentLayout)
        // console.log("Previous layout", prevLayout)
        // console.log("New layout", newLayout)
    }

    /**
     * Copy Link button
     */
    const copyLink = document.querySelector("button.copyLink")
    copyLink.addEventListener("click", event => {
        const link = new URL(location.origin + location.pathname)
        const params = new URLSearchParams()

        if (document.querySelector(".simple-keyboard").classList.contains("active"))
            params.set("keyboard", true)
        params.set("text", english.value)

        link.search = params

        if (navigator.clipboard) {
            navigator.clipboard.writeText(link.toString()).then(async() => {
                console.log("Copy success")
            }, () => console.log("Copy failed"))
        } else {
            const copyText = document.createElement("input")
            try {
                copyText.style = "width: 1px; overflow: hidden; height: 1px; border: 0px"
                copyText.value = link.toString()
                document.body.append(copyText)
                copyText.focus()
                copyText.select()
                copyText.setSelectionRange(0, 99999)
                document.execCommand("copy")
            } finally {
                copyText.remove()
            }
        }
    })

    /**
     * Aurebesh reference match color scheme
     */
    const darkTheme = window.matchMedia('(prefers-color-scheme: dark)')
    function referenceMatchColorScheme({ matches }) {
        document.querySelector("img#aurebesh-reference").src = `./assets/img/Aurebesh-GMSR${matches ? "-dark" : ""}.png`;
    }
    referenceMatchColorScheme(darkTheme)
    darkTheme.addListener(referenceMatchColorScheme)

    /**
     * Subtitle easter egg
     */
    document.querySelector("p i.fa-keyboard").addEventListener("dblclick", function cb(event) {
        const p = document.createElement("p")
        p.className = "subtitle"
        let subtitles = ["THE FORCE AWAKENS", "THE LAST JEDI", "THE RISE OF SKYWALKER"]
        subtitles = subtitles.map(text => text.split("").map(letter => letter === " " ? letter : `<span>${letter}</span>`).join(""))
        console.log(subtitles)
        p.innerHTML = subtitles.join("<br />")
        document.querySelector(".container h1 ~ p").after(p)
        this.removeEventListener("dblclick", cb)
    })

    /** 
      * Aurebesh easter egg
     */
    function aurebeshEasterEgg() {
        const i = document.createElement("i")
        i.className = "fas fa-journal-whills"
        document.querySelector(".translateAurebesh h2").append(i)

        function toggleAurebeshText(element) {
            const classes = element.classList
            classes.toggle("active")
            document.documentElement.style.setProperty(
                "--font",
                classes.contains("active")
                    ? "Aurebesh"
                    : "'ITC Serif Gothic Std', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            )
        }

        const whillsIcon = document.querySelector(".translateArea i.fa-journal-whills")
        whillsIcon.addEventListener("click", event => toggleAurebeshText(event.target))
    }
}