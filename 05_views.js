// In this file you can instantiate your views
// We here first instantiate wrapping views, then the trial views


/** Wrapping views below

* Obligatory properties

    * trials: int - the number of trials this view will appear
    * name: string

*Optional properties
    * buttonText: string - the text on the button (default: 'next')
    * text: string - the text to be displayed in this view
    * title: string - the title of this view

    * More about the properties and functions of the wrapping views - https://magpie-ea.github.io/magpie-docs/01_designing_experiments/01_template_views/#wrapping-views

*/

// Every experiment should start with an intro view. Here you can welcome your participants and tell them what the experiment is about
const intro = magpieViews.view_generator("intro", {
  trials: 1,
  name: 'intro',
  // If you use JavaScripts Template String `I am a Template String`, you can use HTML <></> and javascript ${} inside
  text: `Thank you for participating in this survey! 
            <br />
            <br />
             Your participation is voluntary, meaning that you are free to stop at any time. The data from this survey will be used anonymously for scientific purposes.
            <br />
            <br />
            <strong>Please do not take part in this survey more than once!</strong>.`,
  buttonText: 'begin the experiment'
});

// For most tasks, you need instructions views
const instructions = magpieViews.view_generator("instructions", {
  trials: 1,
  name: 'instructions',
  title: 'General Instructions',
  text: `This survey is concerned with researchers' knowledge of basic statistical concepts. We start by asking you to assess your own level of expertise in statistics.`,
  buttonText: 'go to trials'
});

const begin_main = magpieViews.view_generator("begin", {
    trials: 1,
    name: 'begin',
    title: 'General Instructions',
    text: `In the next part we will show you six statements about the concept "confidence interval". We show you a scientist who has computed a confidence interval, and ask you to judge whether each of the six statements (presented one after the other) logically follows from the result and the definition of "confidence interval". <strong>Do not look up the definition, but judge based on your current understanding of what "confidence intervals" mean!</strong>`,
    buttonText: 'go to trials'
});


// In the post test questionnaire you can ask your participants addtional questions
const post_test = magpieViews.view_generator("post_test", {
  trials: 1,
  name: 'post_test',
  title: 'Additional information',
  text: 'Answering the following questions is optional, but your answers will help us analyze our results.'

  // You can change much of what appears here, e.g., to present it in a different language, as follows:
  // buttonText: 'Weiter',
  // age_question: 'Alter',
  // gender_question: 'Geschlecht',
  // gender_male: 'männlich',
  // gender_female: 'weiblich',
  // gender_other: 'divers',
  // edu_question: 'Höchster Bildungsabschluss',
  // edu_graduated_high_school: 'Abitur',
  // edu_graduated_college: 'Hochschulabschluss',
  // edu_higher_degree: 'Universitärer Abschluss',
  // languages_question: 'Muttersprache',
  // languages_more: '(in der Regel die Sprache, die Sie als Kind zu Hause gesprochen haben)',
  // comments_question: 'Weitere Kommentare'
});

// The 'thanks' view is crucial; never delete it; it submits the results!
const thanks = magpieViews.view_generator("thanks", {
  trials: 1,
  name: 'thanks',
  title: 'Thank you for taking part in this experiment!',
  prolificConfirmText: 'Press the button'
});

/** trial (magpie's Trial Type Views) below

* Obligatory properties

    - trials: int - the number of trials this view will appear
    - name: string - the name of the view type as it shall be known to _magpie (e.g. for use with a progress bar)
            and the name of the trial as you want it to appear in the submitted data
    - data: array - an array of trial objects

* Optional properties

    - pause: number (in ms) - blank screen before the fixation point or stimulus show
    - fix_duration: number (in ms) - blank screen with fixation point in the middle
    - stim_duration: number (in ms) - for how long to have the stimulus on the screen
      More about trial life cycle - https://magpie-ea.github.io/magpie-docs/01_designing_experiments/04_lifecycles_hooks/

    - hook: object - option to hook and add custom functions to the view
      More about hooks - https://magpie-ea.github.io/magpie-docs/01_designing_experiments/04_lifecycles_hooks/

* All about the properties of trial views
* https://magpie-ea.github.io/magpie-docs/01_designing_experiments/01_template_views/#trial-views
*/


// Here, we initialize a normal forced_choice view
const forced_choice_2A = magpieViews.view_generator("forced_choice", {
  // This will use all trials specified in `data`, you can user a smaller value (for testing), but not a larger value
  trials: trial_info.forced_choice.length,
  // name should be identical to the variable name
  name: 'forced_choice_2A',
  data: _.shuffle(trial_info.forced_choice),
  // you can add custom functions at different stages through a view's life cycle
  // hook: {
  //     after_response_enabled: check_response
  // }
});


const statistical_expertise_rating = magpieViews.view_generator("rating_scale", {
    trials: 1,
    name: 'expertise_rating',
    data: [{
        question: "Please indicate your level of statistical experience from 1 (no stats course taken, no practical experience), to 7 (teaching statistics at a university)!",
        optionLeft: '',
        optionRight: ''
    }]
  },
  {
      stimulus_container_generator: function(config, CT) {
          return `<div class='magpie-view'>
                    <h1 class='magpie-view-title'>${config.title}</h1>
                    <p class='magpie-view-question magpie-view-qud'>${config.data[CT].QUD}</p>
                </div>`;
      }
  });

// There are many more templates available:
// forced_choice, slider_rating, dropdown_choice, testbox_input, rating_scale, image_selection, sentence_choice,
// key_press, self_paced_reading and self_paced_reading_rating_scale
