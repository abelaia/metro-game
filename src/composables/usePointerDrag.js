import {ref} from 'vue';

const DRAG_THRESHOLD_PX = 7;
const NO_OFFSET = Object.freeze({x: 0, y: 0});

/**
 * @param {Element} element
 * @param {number} pointerId
 * @returns {boolean}
 */
function capturePointer(element, pointerId) {
    try {
        element.setPointerCapture(pointerId);

        return true;
    } catch {
        return false;
    }
}

/**
 * @param {Object} options
 * @param {() => boolean} options.canDrag
 * @param {() => void} options.onStart
 * @param {(point: {x: number, y: number}) => void} options.onMove
 * @param {(point: {x: number, y: number} | null) => void} options.onEnd null — жест прерван
 */
export function usePointerDrag({canDrag, onStart, onMove, onEnd}) {
    const offset = ref(NO_OFFSET);
    const isDragging = ref(false);

    let startPoint = null;
    let hasDragged = false;

    function handlePointerDown(event) {
        hasDragged = false;

        if (!canDrag()) {
            return;
        }

        startPoint = {x: event.clientX, y: event.clientY};
        capturePointer(event.currentTarget, event.pointerId);
    }

    function handlePointerMove(event) {
        if (!startPoint) {
            return;
        }

        const nextOffset = {x: event.clientX - startPoint.x, y: event.clientY - startPoint.y};

        if (!isDragging.value && Math.hypot(nextOffset.x, nextOffset.y) <= DRAG_THRESHOLD_PX) {
            return;
        }

        if (!isDragging.value) {
            isDragging.value = true;
            onStart();
        }

        offset.value = nextOffset;
        onMove({x: event.clientX, y: event.clientY});
    }

    function finishDrag(point) {
        if (!startPoint) {
            return;
        }

        startPoint = null;

        if (!isDragging.value) {
            return;
        }

        isDragging.value = false;
        hasDragged = true;
        offset.value = NO_OFFSET;
        onEnd(point);
    }

    function handlePointerUp(event) {
        finishDrag({x: event.clientX, y: event.clientY});
    }

    function handlePointerCancel() {
        finishDrag(null);
    }

    function consumeDrag() {
        const wasDragged = hasDragged;

        hasDragged = false;

        return wasDragged;
    }

    return {
        offset,
        isDragging,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handlePointerCancel,
        consumeDrag,
    };
}
