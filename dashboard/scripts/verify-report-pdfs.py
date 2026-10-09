"""QA-only PDF renderer. Install PyMuPDF in work/pdf-tools or your Python environment."""
import json
import sys
from pathlib import Path

app=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(app/'work/pdf-tools'))
import pymupdf

samples=app.parent/'sample-outputs'
shots=samples/'screenshots'
shots.mkdir(parents=True,exist_ok=True)
summary=[]
for path in sorted(samples.glob('*.pdf')):
    doc=pymupdf.open(path)
    audit=json.loads(path.with_suffix('.json').read_text(encoding='utf-8'))
    full='\n'.join(page.get_text() for page in doc)
    for call in audit['calls']:
        assert call['persona']['name'] in full,(path.name,call['persona']['name'])
    assert 'This stage only' in full and 'Cumulative / calls so far' in full
    for number,page in enumerate(doc):
        for block in page.get_text('dict')['blocks']:
            for textline in block.get('lines',[]):
                for span in textline['spans']:
                    x0,y0,x1,y1=span['bbox']
                    assert x0>=25 and x1<=page.rect.width-25,(path.name,number,span['text'],'horizontal clipping')
                    if 85<span['origin'][1]<page.rect.height-42:
                        assert y1<page.rect.height-49,(path.name,number,span['text'],'footer collision')
    for number,label in [(0,'summary'),(1,'stage'),(2,'call-audit')]:
        doc[number].get_pixmap(matrix=pymupdf.Matrix(1.5,1.5)).save(shots/f'{path.stem}-pdf-{label}.png')
    summary.append({'path':path.stem,'pages':len(doc),'calls':len(audit['calls']),'textAndLayout':'passed'})
print(json.dumps(summary,indent=2))
