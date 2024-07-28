export default function includeHTML() {
    return new Promise((resolve, reject) => {
        let elements = document.querySelectorAll("[include-html]");
        let total = elements.length;
        let loaded = 0;

        elements.forEach((elmnt) => {
            let file = elmnt.getAttribute("include-html");
            if (file) {
                fetch(file)
                    .then((response) => {
                        if (response.ok) {
                            return response.text();
                        } else {
                            throw new Error("Network response was not ok.");
                        }
                    })
                    .then((data) => {
                        elmnt.innerHTML = data;
                        elmnt.removeAttribute("include-html");
                        loaded++;
                        if (loaded === total) {
                            resolve();
                        }
                    })
                    .catch((error) => {
                        // loaded++;
                        // if (loaded === total) {
                        //     resolve();
                        // }
                        reject(new Error(`include file "${file}"`));
                    });
            }
        });

        if (total === 0) {
            resolve();
        }
    });
}
