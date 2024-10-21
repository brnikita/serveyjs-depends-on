import React from "react";
import { SurveyCreator, SurveyCreatorComponent } from "survey-creator-react";
import "survey-core/survey.i18n.js";
import "survey-creator-core/survey-creator-core.i18n.js";
import { Serializer } from "survey-core";
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
         "type": "text",
         "name": "question1"
        }
       ]
      }
     ]
    }
    creator.collapseAllPropertyGridCategories();
    creator.expandPropertyGridCategory("Geo Location");
    creator.showSidebar = true;
    return (<SurveyCreatorComponent creator={creator} />);
}

export default SurveyCreatorRenderComponent;