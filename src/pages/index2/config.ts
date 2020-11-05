import { PageConfig } from 'herbjs';

PageConfig({
  "defaultTitle":"绿色出行日",
  "transparentTitle": "auto",
  "titlePenetrate": "YES",
  "barButtonTheme": "light", 
  usingComponents: {
    "live-card": "/components/live-card/live-card",
    "popup-rule": "/components/popup-rule/popup-rule",
    "task-list": "/components/tasklist/tasklist",
    "draw-result": "/components/draw-result/draw-result",
    "jump": "/components/jump/index",
    "popup-task": "/components/popup-task/popup-task",
    "loading-ball":"/components/loading-ball/loading-ball"
  },
});
