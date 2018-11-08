var intro = {
    name: "intro",
    // introduction title
    title: "Welcome!",
    // introduction text
    text:
        "This is a short survey on your understanding of confidence intervals.",
    // introduction's slide proceeding button text
    buttonText: "Begin experiment",
    // render function renders the view
    render: function() {
        var viewTemplate = $("#intro-view").html();

        $("#main").html(
            Mustache.render(viewTemplate, {
                title: this.title,
                text: this.text,
                button: this.buttonText
            })
        );

        var prolificId = $("#prolific-id");
        var IDform = $("#prolific-id-form");
        var next = $("#next");

        var showNextBtn = function() {
            if (prolificId.val().trim() !== "") {
                next.removeClass("nodisplay");
            } else {
                next.addClass("nodisplay");
            }
        };

        if (config_deploy.deployMethod !== "Prolific") {
            IDform.addClass("nodisplay");
            next.removeClass("nodisplay");
        }

        prolificId.on("keyup", function() {
            showNextBtn();
        });

        prolificId.on("focus", function() {
            showNextBtn();
        });

        // moves to the next view
        next.on("click", function() {
            if (config_deploy.deployMethod === "Prolific") {
                exp.global_data.prolific_id = prolificId.val().trim();
            }

            exp.findNextView();
        });
    },
    // for how many trials should this view be repeated?
    trials: 1
};

var instructions = {
    name: "instructions",
    title: "Instructions",
    text:
        "On each trial, you will see the same picture showing a researcher who has computed a confidence interval. You will also see various statements about this result. <p> <strong>Your task is to indicate whether each statement is true or false in virtue of the definition of a confidence interval.</strong>",
    buttonText: "Let's do it!",

    render: function() {
        var viewTemplate = $("#instructions-view").html();
        $("#main").html(
            Mustache.render(viewTemplate, {
                title: this.title,
                text: this.text,
                button: this.buttonText
            })
        );

        // moves to the next view
        $("#next").on("click", function() {
            exp.findNextView();
        });
    },
    trials: 1
};


var main = {
    name: "main",
    render: function(CT) {
        // fill variables in view-template
        var viewTemplate = $("#main-view").html();
        $("#main").html(
            Mustache.render(viewTemplate, {
                question: exp.trial_info.main_trials[CT].question,
                option1: exp.trial_info.main_trials[CT].option1,
                option2: exp.trial_info.main_trials[CT].option2,
                picture: exp.trial_info.main_trials[CT].picture
            })
        );

        // event listener for buttons; when an input is selected, the response
        // and additional information are stored in exp.trial_info
        $("input[name=answer]").on("change", function() {
            var RT = Date.now() - startingTime; // measure RT before anything else
            var trial_data = {
                trial_type: "mainForcedChoice",
                trial_number: CT + 1,
                question: exp.trial_info.main_trials[CT].question,
				condition: exp.trial_info.main_trials[CT].condition,
                option1: exp.trial_info.main_trials[CT].option1,
                option2: exp.trial_info.main_trials[CT].option2,
                option_chosen: $("input[name=answer]:checked").val(),
                RT: RT
            };
            exp.trial_data.push(trial_data);
            exp.findNextView();
        });

        // record trial starting time
        var startingTime = Date.now();
    },
    trials: 6
};

var postTest = {
    name: "postTest",
    title: "Additional Info",
    text:
        "Please answer the following question. Leave a comment if you want to (this is totally optional).",
    buttonText: "Continue",
    render: function() {
        var viewTemplate = $("#post-test-view").html();
        $("#main").html(
            Mustache.render(viewTemplate, {
                title: this.title,
                text: this.text,
                buttonText: this.buttonText
            })
        );

        $("#next").on("click", function(e) {
            // prevents the form from submitting
            e.preventDefault();

            // records the post test info
            exp.global_data.class = $("#class").val();
            exp.global_data.education = $("#education").val();
            exp.global_data.comments = $("#comments")
                .val()
                .trim();
            exp.global_data.endTime = Date.now();
            exp.global_data.timeSpent =
                (exp.global_data.endTime - exp.global_data.startTime) / 60000;

            // moves to the next view
            exp.findNextView();
        });
    },
    trials: 1
};

var thanks = {
    name: "thanks",
    message: "Thank you for taking part in this experiment!",
    render: function() {
        var viewTemplate = $("#thanks-view").html();

        // what is seen on the screen depends on the used deploy method
        //    normally, you do not need to modify this
        if (
            config_deploy.is_MTurk ||
            config_deploy.deployMethod === "directLink"
        ) {
            // updates the fields in the hidden form with info for the MTurk's server
            $("#main").html(
                Mustache.render(viewTemplate, {
                    thanksMessage: this.message
                })
            );
        } else if (config_deploy.deployMethod === "Prolific") {
            $("main").html(
                Mustache.render(viewTemplate, {
                    thanksMessage: this.message,
                    extraMessage:
                        "Please press the button below to confirm that you completed the experiment with Prolific<br />" +
                        "<a href=" +
                        config_deploy.prolificURL +
                        ' class="prolific-url">Confirm</a>'
                })
            );
        } else if (config_deploy.deployMethod === "debug") {
            $("main").html(Mustache.render(viewTemplate, {}));
        } else {
            console.log("no such config_deploy.deployMethod");
        }

        exp.submit();
    },
    trials: 1
};
