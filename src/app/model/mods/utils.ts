
export default class ModsUtils {

    static getAttribute(el, attr) {
        if (!ModsUtils.hasAnyAttribute(el)) {
            return null;
        }
        return el['$'][attr];
    }

    static hasAttribute(el, attr) {
        return ModsUtils.getAttribute(el, attr) != null;
    }

    static hasAttributeWithValue(el, attr, value) {
        return ModsUtils.getAttribute(el, attr) === value;
    }

    static hasAnyAttribute(el) {
        return el['$'] && Object.keys(el['$']).length > 0;
    }

    static createEmptyField() {
        return [{ '_': ''}];
    }

    static createTextElement(value, attrs) {
        const obj = {
            '_': value
        };
        if (attrs) {
            obj['$'] = attrs;
        }
        return obj;
    }

    static createObjWithTextElement(name, value, attrs) {
        const obj = {};
        const o = ModsUtils.createTextElement(value, attrs);
        obj[name] = [o];
        return obj;
    }


    static dcEl(element: string, text: string): string {
        return '  <dc:' + element + '>'
              + text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
              + '</dc:' + element + '>\n';
    }


    static moveDown(array, index: number) {
        if (index < array.length - 1) {
            const x = array[index];
            array[index] = array[index + 1];
            array[index + 1] = x;
        }
    }

    static moveUp(array, index: number) {
        if (index > 0) {
            const x = array[index];
            array[index] = array[index - 1];
            array[index - 1] = x;
        }
    }

}
