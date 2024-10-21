import React from "react";
import { createRoot } from "react-dom/client";
import SurveyCreatorRenderComponent from "./SurveyCreatorComponent";

const root = createRoot(document.getElementById("surveyCreatorContainer"));
root.render(React.createElement(SurveyCreatorRenderComponent));
