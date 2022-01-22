import Editor from "@draft-js-plugins/editor";
import createMentionPlugin, {
  defaultSuggestionsFilter,
} from "@draft-js-plugins/mention";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import db from "../lib/firebase";
import { insertCharacter } from "../lib/draft-utils";
import { convertToRaw } from "draft-js";

export default function DraftEditor({
  editorState,
  setEditorState,
  onInputChange,
  maxLength = 150,
}) {
  const [usersCol] = useCollectionData(db.collection("users"));
  const users = usersCol?.map((user) => ({
    ...user,
    name: user.username,
  }));
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(users?.slice(0, 5));

  const editorRef = useRef();

  const { plugins, MentionSuggestions } = useMemo(() => {
    const mentionPlugin = createMentionPlugin();
    const { MentionSuggestions } = mentionPlugin;
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  function onSearchChange({ value }) {
    setSuggestions(defaultSuggestionsFilter(value, users));
  }

  function onMention() {
    const newEditorState = insertCharacter("@", editorState);
    setEditorState(newEditorState);
  }

  function handleBeforeInput() {
    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText().length;

    if (currentContentLength > maxLength - 1) {
      console.log(`You can type max ${maxLength} characters`);

      return "handled";
    }
  }

  function handlePastedText(pastedText) {
    const contentState = editorState.getCurrentContent();
    const characterLength = contentState.getPlainText().length;

    if (characterLength + pastedText.length > maxLength) {
      console.log(`You can type max ${maxLength} characters`);

      return "handled";
    }
  }

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const characterLength = contentState.getPlainText().length;
    const raw = convertToRaw(contentState);
    onInputChange({ raw, characterLength });
  }, [editorState, onInputChange]);

  return (
    <div className="editor-container">
      <div className="editor-wrapper">
        <div className="editor-inner">
          <div
            onClick={() => {
              editorRef.current.focus();
            }}
          >
            <Editor
              editorState={editorState}
              onChange={setEditorState}
              plugins={plugins}
              ref={editorRef}
              handleBeforeInput={handleBeforeInput}
              handlePastedText={handlePastedText}
            />
            <MentionSuggestions
              entryComponent={Entry}
              open={open}
              onOpenChange={(open) => setOpen(open)}
              suggestions={suggestions || []}
              onSearchChange={onSearchChange}
            />
          </div>
        </div>
      </div>
      <button className="editor-mention-button" onClick={onMention}>
        <img src="/at-icon.svg" alt="At Icon" className="editor-mention-icon" />
      </button>
      <button className="editor-hashtag-button">
        <img
          src="/hashtag-icon.svg"
          alt="Hashtag Icon"
          className="editor-hashtag-icon"
        />
      </button>
    </div>
  );
}

function Entry(props) {
  const { mention, theme, searchValue, isFocused, ...parentProps } = props;

  return (
    <div {...parentProps}>
      <div className="entry-container">
        <div className="entry-container-left">
          <img src={mention.photoURL} className="entry-avatar" alt="" />
        </div>

        <div className="entry-container-right">
          <div className="entry-text">{mention.name}</div>

          <div className="entry-title">{mention.displayName}</div>
        </div>
      </div>
    </div>
  );
}
