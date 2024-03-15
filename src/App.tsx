import "./App.css";
import { r, RecordNode, RT } from "@gmetrixr/ai-rjson";
import StyledDropzone from "./Dropzone.tsx";
import { Base, Uploader } from "./styles.tsx";
import { useState } from "react";

function App() {
  const [prettyPrint, setPrettyPrint] = useState("");

  async function onDrop(acceptedFiles: File[]) {
    if (!acceptedFiles[0]) {
      return;
    }
    const file = acceptedFiles[0];
    const text = await file.text();
    const json = JSON.parse(text);
    const pretty = prettyPrintConceptsWithGames(json);
    setPrettyPrint(pretty);
  }

  function reUpload() {
    setPrettyPrint("");
  }

  return (
    <Base>
      {
        prettyPrint ?
          <>
            <button onClick={reUpload}>RE-UPLOAD</button>
          <pre>
            {prettyPrint}
          </pre>
          </> :
          <Uploader>
            <StyledDropzone onDrop={onDrop} maxFiles={1} />
          </Uploader>
      }
    </Base>
  );
}

export function prettyPrintConceptsWithGames(brain: RecordNode<RT>, str = "", depth = 1) {
  const recordF = r.record(brain);
  if (depth === 1) {
    const gamesAtRoot = recordF.getRecords(RT.game);
    str += `
      Root | ${gamesAtRoot.map(g => g.props.name)}
    `;
  }
  const concepts = recordF.getRecords(RT.concept);

  for (const c of concepts) {
    const games = r.record(c).getRecords(RT.game);
    str += `
    ${tabs(depth)} ${depth}. ${c.props.title} | ${c.props.relevance_score} | ${games.map(g => g.props.name).join(",")}`;
    str = prettyPrintConceptsWithGames(c, str, depth + 1);
  }

  return str;
}

function tabs(d: number) {
  let str = "";
  while (d > 0) {
    str += "\t";
    d--;
  }

  return str;
}

export default App;
