import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { animated } from '@react-spring/web';
import { IConfirmAction } from 'types';
import useConfirmAction from 'hooks/useConfirmAction';

const ConfirmAction: React.FC<IConfirmAction> = ({
    open,
    title,
    question,
    onConfirm,
    onDiscard
}) => {
    const { isOpen, modalStyles, handleConfirmAction, handleDiscardAction } =
        useConfirmAction(open, onConfirm, onDiscard);

    return (
        <>
            {isOpen
                ? createPortal(
                      <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full z-[150]">
                          <animated.div
                              style={{ transform: modalStyles.transform }}
                              className="rounded w-full mt-6 sm:w-[400px] lg:w-[500px] z-[250] bg-gray-200 mx-2 p-8"
                          >
                              <div>
                                  <h2 className="text-gray-800 text-lg md:text-xl xl:text-2xl mb-4 [text-shadow:_1px_1px_1px_rgb(255_255_255_/_100%)]">
                                      {title}
                                  </h2>
                                  <p>{question}</p>
                                  <div className="flex pt-4">
                                      <button
                                          className="bg-gray-600 hover:bg-gray-500 text-gray-200 mr-4 p-2 mb-4 rounded cursor-pointer disabled:bg-gray-400"
                                          onClick={handleConfirmAction}
                                      >
                                          Confirm
                                      </button>
                                      <button
                                          className="bg-gray-200 hover:bg-gray-300 text-gray-600 border-2 border-gray-600 p-2 mb-4 rounded cursor-pointer disabled:bg-gray-400"
                                          onClick={handleDiscardAction}
                                      >
                                          Discard
                                      </button>
                                  </div>
                              </div>
                          </animated.div>
                          <animated.div
                              style={{ opacity: modalStyles.opacity }}
                              className="fixed top-0 left-0 w-full h-full z-[200] bg-gray-900"
                          />
                      </div>,
                      document.body
                  )
                : null}
        </>
    );
};

ConfirmAction.propTypes = {
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onDiscard: PropTypes.func.isRequired
};

export default ConfirmAction;
