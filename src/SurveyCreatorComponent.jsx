import React from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import "survey-core/survey.i18n.js";
import "survey-creator-core/survey-creator-core.i18n.js";
import { Serializer, QuestionFactory, Question } from "survey-core";
import "survey-core/defaultV2.css";
import "survey-creator-core/survey-creator-core.css";

Serializer.addProperty("survey", {
  name: "region",
  category: "Geo Location",
  categoryIndex: 1,
  choices: ["Africa", "Americas", "Asia", "Europe", "Oceania"],
});

Serializer.addProperty("survey", {
  name: "country",
  category: "Geo Location",
  dependsOn: [ "region" ],
  // Populate countries depending on the selected region
  choices: function (obj, choicesCallback) {
    if (!choicesCallback)
      return;
    const xhr = new XMLHttpRequest();
    const url = !!obj && !!obj.region
      ? "https://surveyjs.io/api/CountriesExample?region=" + obj.region
      : "https://surveyjs.io/api/CountriesExample";
    xhr.open("GET", url);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload = function () {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        const result = [];
        result.push({ value: null });
        for (let i = 0; i < response.length; i++) {
          const item = response[i];
          const val = item.cioc;
          result.push({ value: val, text: item.name });
        }
        choicesCallback(result);
      }
    };
    xhr.send();
  }
});

Serializer.addProperty("text", {
  name: "dateFormat",
  dependsOn: [ "inputType" ],
  // Display "Date format" only if `inputType` is one of date types
  visibleIf: function(obj) {
    return (
      obj.inputType === "date" ||
      obj.inputType === "datetime" ||
      obj.inputType === "datetime-local"
    );
  },
  category: "general",
  visibleIndex: 7
});

// Define the new GeoLocation question type
Serializer.addClass(
  "geolocation",
  [
    { name: "region", category: "Geo Location", choices: ["Africa", "Americas", "Asia", "Europe", "Oceania"] },
    { 
      name: "country", 
      category: "Geo Location",
      dependsOn: ["region"],
      choices: function (obj, choicesCallback) {
        if (!choicesCallback) return;
        const xhr = new XMLHttpRequest();
        const url = !!obj && !!obj.region
          ? "https://surveyjs.io/api/CountriesExample?region=" + obj.region
          : "https://surveyjs.io/api/CountriesExample";
        xhr.open("GET", url);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.response);
            const result = [];
            result.push({ value: null });
            for (let i = 0; i < response.length; i++) {
              const item = response[i];
              const val = item.cioc;
              result.push({ value: val, text: item.name });
            }
            choicesCallback(result);
          }
        };
        xhr.send();
      }
    }
  ],
  function () {
    return new GeoLocationQuestion(this.name);
  },
  "question"
);

// Define the GeoLocationQuestion class
class GeoLocationQuestion extends Question {
  constructor(name) {
    super(name);
    this.region = null;
    this.country = null;
  }
  getType() {
    return "geolocation";
  }
}

// Register the new question type
QuestionFactory.Instance.registerQuestion("geolocation", (name) => {
  return new GeoLocationQuestion(name);
});

function SurveyCreatorRenderComponent() {
    const options = {
        showLogicTab: true
    };
    const creator = new SurveyCreator(options);
    creator.JSON = {
     "logoPosition": "right",
     "pages": [
      {
       "name": "page1",
       "elements": [
        {
         "type": "geolocation",
         "name": "geoQuestion"
        }
       ]
      }
     ]
    };
    creator.onDesignerSurveyCreated.add(function(_, options) {
      options.survey.onPropertyChanged.add(function(_, options) {
        if (options.name === "region") {
          options.question.country = null;
        }
      });
    });
    creator.collapseAllPropertyGridCategories();
    creator.expandPropertyGridCategory("Geo Location");
    creator.showSidebar = true;
    return (<SurveyCreatorComponent creator={creator} />);
}

export default SurveyCreatorRenderComponent;
