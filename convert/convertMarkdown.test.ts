import { existsSync, mkdirSync, readFile, readFileSync, writeFile, writeFileSync } from 'fs';
import path from 'path';
import { beforeEach, describe, expect, it, test } from 'vitest';
import { convertMarkdownsToHTML, convertMarkdownsToMilestones } from './convertMarkdown';

describe('convertMarkdownsToMilestones', () => {
    const data = readFileSync(path.join('test_data', 'books', 'C01', '01GENengWEBbd.usfm'), 'utf8');
    let modifiedContent: string;
    beforeEach(() => {
        modifiedContent = convertMarkdownsToMilestones(data, 'C01', 'GEN');
    });
    it('converts an image markdown to a figure', () => {
        // Gen 3:14 translates this ![The serpent](Serpent.png)
        expect(modifiedContent).toContain('\\fig The serpent|src="Serpent.png" size="span"\\fig*');
    });
    it('converts a telephone markdown to a milestone', () => {
        // Gen 3:14 translates this [TEL](tel:6145551212)
        expect(modifiedContent).toContain('\\jmp TEL|href="tel:6145551212"\\jmp*');
    });
    it('converts an email markdown to a milestone', () => {
        // Gen 3:14 translates this [EMAIL DAVID](mailto:david_moore1@sil.org)
        expect(modifiedContent).toContain(
            '\\jmp EMAIL DAVID|href="mailto:david_moore1@sil.org"\\jmp*'
        );
    });
    it('converts a web link markdown with tooltip to a milestone', () => {
        // Gen 3:13 translates this [Web Link](https://www.sil.org/ "SIL Global")
        expect(modifiedContent).toContain(
            '\\jmp Web Link|href="https://www.sil.org/" title="SIL Global"\\jmp*'
        );
    });
    it('converts a web link markdown without tooltip to a milestone', () => {
        // Gen 3:14 translates this [Software](https://software.sil.org)
        expect(modifiedContent).toContain('\\jmp Software|href="https://software.sil.org"\\jmp*');
    });
    it('adds an empty markdown as text ', () => {
        // Gen 3:13 adds [Empty Markdown to text]
        expect(modifiedContent).toContain('“What have you done?” [Empty Markdown]');
    });
    it('converts an audio clip markdown to a milestone', () => {
        // Gen 3:12 translates this [Audio](audioclip.mp3)
        expect(modifiedContent).toContain(
            '\\zaudioc-s |link="audioclip.mp3" \\*Audio\\zaudioc-e\\*'
        );
    });
    it('converts a full reference markdown to a milestone', () => {
        // Gen 3:11 translates [Beatitudes](C01.MAT.5.1)
        expect(modifiedContent).toContain(
            '\\zreflink-s |link="C01.MAT.5.1"\\*Beatitudes\\zreflink-e\\*'
        );
    });
    it('converts a markdown reference without a book collection', () => {
        // Gen 3:10 translates [No BC Link](MAT.5.1)
        expect(modifiedContent).toContain(
            '\\zreflink-s |link="C01.MAT.5.1"\\*No BC Link\\zreflink-e\\*'
        );
    });
    it('converts a markdown reference without book collection or verse', () => {
        // Gen 3:9 translates [No BC No Verse Link](MAT.5)
        expect(modifiedContent).toContain(
            '\\zreflink-s |link="C01.MAT.5.1"\\*No BC No Verse Link\\zreflink-e\\*'
        );
    });
    it('converts a markdown reference with just chapter verse', () => {
        // Gen 3:8 translates [Just chapter verse](7.1)
        expect(modifiedContent).toContain(
            '\\zreflink-s |link="C01.GEN.7.1"\\*Just chapter verse\\zreflink-e\\*'
        );
    });
    it('converts an image markdown to a figure', () => {
        const input = '![The serpent](Serpent.png "A Tooltip")';
        const output = convertMarkdownsToMilestones(input, 'C01', 'GEN');
        // Figures do not support tooltips
        expect(output).toContain('\\fig The serpent|src="Serpent.png" size="span"\\fig*');
    });
    it('converts a web link markdown to a milestone with tooltip', () => {
        const input = '[Web Link](https://www.sil.org/ "SIL Global")';
        const output = convertMarkdownsToMilestones(input, 'C01', 'GEN');
        expect(output).toContain(
            '\\jmp Web Link|href="https://www.sil.org/" title="SIL Global"\\jmp*'
        );
    });
});

describe('convertMarkdownsToHTML', () => {
    describe('converting image markdown', () => {
        const out = convertMarkdownsToHTML(
            'This is my image: ![The serpent](Serpent.png) More text'
        );

        const prefix = 'This is my image: <img';
        const postfix = '> More text';

        it('has correct prefix', () => {
            expect(out.substring(0, prefix.length)).toBe(prefix);
        });
        it('has correct postfix', () => {
            expect(out.substring(out.length - postfix.length, out.length)).toBe(postfix);
        });
        it('has src attribute', () => {
            expect(out.substring(prefix.length, out.length - postfix.length)).contains(
                'src="Serpent.png"'
            );
        });
        it('has alt attribute', () => {
            expect(out.substring(prefix.length, out.length - postfix.length)).contains(
                'alt="The serpent"'
            );
        });
    });
    describe('converting web link markdown', () => {
        const out = convertMarkdownsToHTML(
            'Please visit our [website](https://www.sil.org/) for more info.'
        );

        const prefix = 'Please visit our <a';
        const postfix = '>website</a> for more info.';
        it('has correct prefix', () => {
            expect(out.substring(0, prefix.length)).toBe(prefix);
        });
        it('has correct postfix', () => {
            expect(out.substring(out.length - postfix.length, out.length)).toBe(postfix);
        });
        it('has href attribute', () => {
            expect(out.substring(prefix.length, out.length - postfix.length)).contains(
                'href="https://www.sil.org/"'
            );
        });
    });
    describe('converting web link markdown', () => {
        const out = convertMarkdownsToHTML(
            'Please [EMAIL DAVID](mailto:david_moore1@sil.org) with all your questions'
        );

        const prefix = 'Please <a';
        const postfix = '>EMAIL DAVID</a> with all your questions';
        it('has correct prefix', () => {
            expect(out.substring(0, prefix.length)).toBe(prefix);
        });
        it('has correct postfix', () => {
            expect(out.substring(out.length - postfix.length, out.length)).toBe(postfix);
        });
        it('has href attribute', () => {
            expect(out.substring(prefix.length, out.length - postfix.length)).contains(
                'href="mailto:david_moore1@sil.org"'
            );
        });
    });
    describe('converting telephone link markdown', () => {
        const out = convertMarkdownsToHTML(
            'Please [call us](tel:6145551212) with all your questions'
        );

        const prefix = 'Please <a';
        const postfix = '>call us</a> with all your questions';
        it('has correct prefix', () => {
            expect(out.substring(0, prefix.length)).toBe(prefix);
        });
        it('has correct postfix', () => {
            expect(out.substring(out.length - postfix.length, out.length)).toBe(postfix);
        });
        it('has href attribute', () => {
            expect(out.substring(prefix.length, out.length - postfix.length)).contains(
                'href="tel:6145551212"'
            );
        });
    });
    it('converts empty link to simple text', () => {
        const input = 'This [link]() does nothing';
        const out = convertMarkdownsToHTML(input);
        expect(out).toBe('This link does nothing');
    });
    it('does not convert invalid link', () => {
        const input = 'This [link](anisondfsao) is bogus';
        const out = convertMarkdownsToHTML(input);
        expect(out).toBe(input);
    });
    it('converts an image markdown to HTML with tooltip', () => {
        const input = '![The serpent](Serpent.png "A Tooltip")';
        const output = convertMarkdownsToHTML(input);
        expect(output).toBe(
            '<span class="dy-tooltip" data-tip="A Tooltip" style="display: inline;"><img src="Serpent.png" alt="The serpent"></span>'
        );
    });
    it('converts a web link markdown to HTML with tooltip', () => {
        const input = '[Web Link](https://www.sil.org/ "SIL Global")';
        const output = convertMarkdownsToHTML(input);
        expect(output).toBe(
            '<span class="dy-tooltip" data-tip="SIL Global" style="display: inline;"><a href="https://www.sil.org/">Web Link</a></span>'
        );
    });
});
