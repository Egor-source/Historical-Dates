import React, { FC, useEffect, useRef, useState } from 'react';
import * as styles from './styles.module.scss';
import { Editor } from '@monaco-editor/react';
import { JsonEditorType } from './types';
import { Slide } from '../historical-dates/types';
const JsonEditor: FC<JsonEditorType> = ({ slides, onSave }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [localSlides, setLocalSlides] = useState(JSON.stringify(slides, null, 2));
  const [editorHeight, setEditorHeight] = useState(400);
  const editorWrapperRef = useRef<any>(null);
  const isResizingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);
  const [showOpenButton, setShowOpenButton] = useState(true);

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isResizingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = editorHeight;
    document.body.style.cursor = 'row-resize';
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) return;
    const dy = e.clientY - startYRef.current;
    const newHeight = startHeightRef.current - dy; // тянем вверх/вниз
    if (newHeight > 200 && newHeight < window.innerHeight - 100) {
      setEditorHeight(newHeight);
    }
  };

  const onMouseUp = () => {
    if (isResizingRef.current) {
      isResizingRef.current = false;
      document.body.style.cursor = 'default';
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowOpenButton(true);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    window.addEventListener('mousemove', onMouseMove, { signal });
    window.addEventListener('mouseup', onMouseUp, { signal });
    window.addEventListener('keydown', handleKeyDown, { signal });
    return () => {
      abortController.abort();
    };
  }, []);

  function validateSlideData(data: any) {
    if (!Array.isArray(data)) {
      return 'Корень должен быть массивом объектов';
    }

    if (data.length < 2) {
      return 'Ошибка: Слайдов не может быть меньше 2х';
    }
    if (data.length > 6) {
      return 'Ошибка: Слайдов не может быть больше 6';
    }

    for (let i = 0; i < data.length; i++) {
      const slide = data[i];

      if (typeof slide !== 'object' || slide === null) {
        return `Элемент массива slides[${i}] должен быть объектом`;
      }

      if (!slide.dates || typeof slide.dates !== 'object') {
        return `slides[${i}].dates обязательно и должно быть объектом`;
      }
      const { start, end } = slide.dates;
      if (typeof start !== 'number' || typeof end !== 'number') {
        return `slides[${i}].dates.start и slides[${i}].dates.end должны быть числами`;
      }

      if (slide.title && typeof slide.title !== 'string') {
        return `slides[${i}].title должно быть строкой, если указано`;
      }

      if (!Array.isArray(slide.content)) {
        return `slides[${i}].content обязательно и должно быть массивом`;
      }

      if (slide.content.length === 0) {
        return `slides[${i}].content не может быть пустым`;
      }

      for (let j = 0; j < slide.content.length; j++) {
        const item = slide.content[j];
        if (typeof item !== 'object' || item === null) {
          return `slides[${i}].content[${j}] должен быть объектом`;
        }

        if (typeof item.title !== 'number') {
          return `slides[${i}].content[${j}].title обязательно и должно быть числом`;
        }

        if (typeof item.text !== 'string') {
          return `slides[${i}].content[${j}].text обязательно и должно быть строкой`;
        }
      }
    }

    return null;
  }

  const onChange = (value: string | undefined) => {
    if (value) setLocalSlides(value);
  };

  const openEditor = () => {
    setLocalSlides(JSON.stringify(slides, null, 2));
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
  };

  const saveEditor = () => {
    try {
      const parsedSlides: Slide[] = JSON.parse(localSlides);
      const error = validateSlideData(parsedSlides);
      if (error) {
        alert(error);
        return;
      }
      onSave(parsedSlides);
      closeEditor();
    } catch (e) {
      alert('Ошибка в JSON: неверный синтаксис. Проверьте запятые, кавычки и скобки.');
    }
  };

  const handleOpenButtonContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowOpenButton(false);
  };

  return (
    <>
      {showOpenButton && !showEditor && (
        <button
          onClick={openEditor}
          onContextMenu={handleOpenButtonContextMenu}
          className={styles.openEditor}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#000000"
          >
            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
          </svg>
        </button>
      )}
      {showEditor && (
        <div
          className={styles.editorWrapper}
          ref={editorWrapperRef}
          style={{ height: editorHeight }}
        >
          <div className={styles.resize} onMouseDown={onMouseDown} />
          <div className={styles.editorButtonsWrapper}>
            <button onClick={closeEditor} className={styles.closeEditor}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </button>
            <button onClick={saveEditor} className={styles.saveEditor}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM565-275q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z" />
              </svg>
            </button>
          </div>
          <Editor
            height="100%"
            defaultLanguage="json"
            defaultValue={localSlides}
            onChange={onChange}
          />
        </div>
      )}
    </>
  );
};

export default JsonEditor;
