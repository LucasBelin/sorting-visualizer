export const animationType = {
    color: "color",
    swap: "swap",
}

export const colors = {
    unsorted: "#37aff7",
    selected: "#ff7043",
    sorted: "#54ff51",
}

export default function sort(type, values) {
    switch (type) {
        case "merge":
            return mergeSort(values);
        case "bubble":
            return bubbleSort(values);
        case "heap":
            return heapSort(values);
        case "quick":
            return quickSort(values);
        case "selection":
            return selectionSort(values);
        case "comb":
            return combSort(values);
        case "gnome":
            return gnomeSort(values);
        case "oddeven":
            return oddEvenSort(values);
        default:
            return [];
    }
}

function mergeSort(values) {
    const animations = [];
    function merge(arr, l, m, r) {
        let temp = arr.slice();
        let left = l;
        let right = m + 1;
        let pos = left;

        while (left <= m || right <= r) {
            if (left <= m && right <= r) {
                if (temp[left] <= temp[right]) {
                    if (pos !== left) {
                        animations.push(createColorAnimation([pos, left]))
                        animations.push(createSwapAnimation([pos, left], [pos], [temp[left]]));
                    }

                    arr[pos++] = temp[left++];
                }
                else {
                    if (pos !== right) {
                        animations.push(createColorAnimation([pos, right]))
                        animations.push(createSwapAnimation([pos, right], [pos], [temp[right]]));
                    }
                    arr[pos++] = temp[right++];
                }
            }
            else if (left <= m) {
                if (pos !== left) {
                    animations.push(createColorAnimation([pos, left]))
                    animations.push(createSwapAnimation([pos, left], [pos], [temp[left]]));
                }
                arr[pos++] = temp[left++];
            }
            else if (right <= r) {
                if (pos !== right) {
                    animations.push(createColorAnimation([pos, right]))
                    animations.push(createSwapAnimation([pos, right], [pos], [temp[right]]));
                }
                arr[pos++] = temp[right++];
            }
        }
    }

    function sort(arr, l, r) {
        if (l < r) {
            const m = parseInt((l + r) / 2);
            sort(arr, l, m);
            sort(arr, m + 1, r);
            merge(arr, l, m, r);
        }
    }

    sort(values, 0, values.length - 1);
    return animations;
}

function bubbleSort(values) {
    const animations = [];
    const n = values.length;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (values[j] > values[j + 1]) {
                animations.push(createColorAnimation([j, j + 1]));
                animations.push(createSwapAnimation([j, j + 1], [j, j + 1], [values[j + 1], values[j]]));
                swap(values, j, j + 1);
            }
        }
    }
    return animations;
}

function heapSort(values) {
    const animations = [];
    function heapify(arr, i, m) {
        let j;
        while (2 * i + 1 <= m) {
            j = 2 * i + 1;
            if (j < m) {
                if (arr[j] < arr[j + 1])
                    j++;
            }
            if (arr[i] < arr[j]) {
                animations.push(createColorAnimation([i, j]));
                animations.push(createSwapAnimation([i, j], [i, j], [arr[j], arr[i]]));
                swap(arr, i, j);
                i = j;
            }
            else {
                i = m;
            }
        }
    }

    for (let i = parseInt((values.length - 2) / 2); i >= 0; i--) {
        heapify(values, i, values.length - 1);
    }
    for (let i = values.length - 1; i > 0; i--) {
        animations.push(createColorAnimation([0, i]));
        animations.push(createSwapAnimation([0, i], [0, i], [values[i], values[0]]));
        swap(values, 0, i);
        heapify(values, 0, i - 1);
    }
    return animations;
}

function quickSort(values) {
    const animations = [];
    function partition(arr, start, end) {
        const pivotValue = arr[end];
        let pivotIndex = start;
        for (let i = start; i < end; i++) {
            if (arr[i] < pivotValue) {
                if (i !== pivotIndex) {
                    animations.push(createColorAnimation([i, pivotIndex]));
                    animations.push(createSwapAnimation([i, pivotIndex], [i, pivotIndex], [arr[pivotIndex], arr[i]]));
                }
                [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
                pivotIndex++;
            }
        }

        if (end !== pivotIndex) {
            animations.push(createColorAnimation([end, pivotIndex]));
            animations.push(createSwapAnimation([end, pivotIndex], [end, pivotIndex], [arr[pivotIndex], arr[end]]));
        }
        [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]]
        return pivotIndex;
    };

    function sort(arr, start, end) {
        if (start >= end) {
            return;
        }
        let index = partition(arr, start, end);
        sort(arr, start, index - 1);
        sort(arr, index + 1, end);
    }

    sort(values, 0, values.length - 1);
    return animations;
}

function selectionSort(values) {
    const animations = [];
    for (let i = 0; i < values.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < values.length; j++) {
            if (values[j] < values[minIndex]) {
                minIndex = j;
            }
        }
        if (i !== minIndex) {
            animations.push(createColorAnimation([i, minIndex]));
            animations.push(createSwapAnimation([i, minIndex], [i, minIndex], [values[minIndex], values[i]]));
        }
        swap(values, i, minIndex);
    }
    return animations;
}

function combSort(values) {
    const animations = [];
    let gap = values.length;
    const shrink = 1.3;
    let swapped = false;
    let i;
    while (gap !== 1 || swapped) {
        gap = parseInt(gap / shrink);
        if (gap < 1)
            gap = 1;
        i = 0;
        swapped = false;
        while (i + gap < values.length) {
            if (values[i] > values[i + gap]) {
                animations.push(createColorAnimation([i, i + gap]));
                animations.push(createSwapAnimation([i, i + gap], [i, i + gap], [values[i + gap], values[i]]));
                const temp = values[i];
                values[i] = values[i + gap];
                values[i + gap] = temp;
                swapped = true;
            }
            i++
        }
    }
    return animations;
}

function gnomeSort(values) {
    const animations = [];
    let pos = 1;
    while (pos < values.length) {
        if (values[pos] >= values[pos - 1]) {
            pos++;
        }
        else {
            animations.push(createColorAnimation([pos, pos - 1]));
            animations.push(createSwapAnimation([pos, pos - 1], [pos, pos - 1], [values[pos - 1], values[pos]]));
            swap(values, pos, pos - 1);
            if (pos > 1)
                pos--;
        }
    }
    return animations;
}

function oddEvenSort(values) {
    const animations = [];
    let sorted = false;
    while (!sorted) {
        sorted = true;
        for (let i = 1; i < values.length - 1; i += 2) {
            if (values[i] > values[i + 1]) {
                animations.push(createColorAnimation([i, i + 1]));
                animations.push(createSwapAnimation([i, i + 1], [i, i + 1], [values[i + 1], values[i]]));
                swap(values, i, i + 1);
                sorted = false;
            }
        }
        for (let i = 0; i < values.length - 1; i += 2) {
            if (values[i] > values[i + 1]) {
                animations.push(createColorAnimation([i, i + 1]));
                animations.push(createSwapAnimation([i, i + 1], [i, i + 1], [values[i + 1], values[i]]));
                swap(values, i, i + 1);
                sorted = false;
            }
        }
    }
    return animations;
}

function swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
}

function createColorAnimation(barsToColor, color) {
    return {
        type: animationType.color,
        color: color ? color : colors.selected,
        barsToColor: barsToColor
    }
}

function createSwapAnimation(barsToColor, swapIndices, swapValues) {
    return {
        type: animationType.swap,
        color: colors.unsorted,
        barsToColor: barsToColor,
        swapIndices: swapIndices,
        swapValues: swapValues
    }
}