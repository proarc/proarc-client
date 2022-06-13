
export default class ModsUtils {

    static getAttribute(el: any, attr: string) {
        if (!ModsUtils.hasAnyAttribute(el)) {
            return null;
        }
        return el['$'][attr];
    }

    static hasAttribute(el: any, attr: string) {
        return ModsUtils.getAttribute(el, attr) != null;
    }

    static hasAttributeWithValue(el: any, attr: string, value: any) {
        return ModsUtils.getAttribute(el, attr) === value;
    }

    static hasAnyAttribute(el: any) {
        return el['$'] && Object.keys(el['$']).length > 0;
    }

    static createEmptyField() {
        return [{ '_': ''}];
    }

    static createTextElement(value: any, attrs: any) {
        const obj: any = {
            '_': value
        };
        if (attrs) {
            obj['$'] = attrs;
        }
        return obj;
    }

    static createObjWithTextElement(name: any, value: any, attrs: any) {
        const obj: any = {};
        const o = ModsUtils.createTextElement(value, attrs);
        obj[name] = [o];
        return obj;
    }


    static dcEl(element: string, text: string): string {
        return '  <dc:' + element + '>'
              + text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
              + '</dc:' + element + '>\n';
    }

}
