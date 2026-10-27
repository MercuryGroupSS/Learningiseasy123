"""Build the game's own numeric font from the same centerlines used for tracing.
Requires: fonttools, shapely, brotli. No font service or third-party typeface.
"""
from pathlib import Path
import re
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.basePen import BasePen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.svgLib.path import parse_path
from shapely.geometry import LineString
from shapely.geometry.polygon import orient
from shapely.ops import unary_union
ROOT=Path(__file__).resolve().parents[1]
source=(ROOT/'index.html').read_text()
paths=dict(re.findall(r"(\d):'([^']+)'",source.split('const glyphs={',1)[1].split('};',1)[0]))
class Flatten(BasePen):
 def __init__(self):super().__init__(None);self.strokes=[];self.points=[]
 def flush(self):
  if len(self.points)>1:self.strokes.append(self.points)
  self.points=[]
 def _moveTo(self,p):self.flush();self.points=[p]
 def _lineTo(self,p):self.points.append(p)
 def _curveToOne(self,p1,p2,p3):
  p0=self._getCurrentPoint()
  for i in range(1,25):
   t=i/24;u=1-t;self.points.append(tuple(u*u*u*p0[j]+3*u*u*t*p1[j]+3*u*t*t*p2[j]+t*t*t*p3[j] for j in range(2)))
 def _qCurveToOne(self,p1,p2):
  p0=self._getCurrentPoint()
  for i in range(1,17):
   t=i/16;u=1-t;self.points.append(tuple(u*u*p0[j]+2*u*t*p1[j]+t*t*p2[j] for j in range(2)))
 def _closePath(self):
  if self.points:self.points.append(self.points[0])
  self.flush()
 def _endPath(self):self.flush()
order=['.notdef']+[f'digit{n}' for n in range(10)];glyphs={'.notdef':TTGlyphPen(None).glyph()}
for n in range(10):
 flat=Flatten();parse_path(paths[str(n)],flat);flat.flush()
 shape=unary_union([LineString([(x*8-80,(100-y)*10) for x,y in stroke]).buffer(26,quad_segs=5,cap_style=1,join_style=1) for stroke in flat.strokes])
 pen=TTGlyphPen(None)
 for polygon in ([shape] if shape.geom_type=='Polygon' else shape.geoms):
  polygon=orient(polygon,sign=-1)
  for ring in [polygon.exterior,*polygon.interiors]:
   points=list(ring.coords)[:-1];pen.moveTo(points[0])
   for pt in points[1:]:pen.lineTo(pt)
   pen.closePath()
 glyphs[f'digit{n}']=pen.glyph()
font=FontBuilder(1000,isTTF=True);font.setupGlyphOrder(order);font.setupCharacterMap({ord(str(n)):f'digit{n}' for n in range(10)});font.setupGlyf(glyphs);font.setupHorizontalMetrics({name:(700,0) for name in order});font.setupHorizontalHeader(ascent=900,descent=-100)
font.setupNameTable({'familyName':'Garden Written Numbers','styleName':'Regular','uniqueFontIdentifier':'NumberGarden-Written-1','fullName':'Garden Written Numbers','psName':'GardenWrittenNumbers-Regular','version':'Version 1.0'})
font.setupOS2(sTypoAscender=900,sTypoDescender=-100,usWinAscent=900,usWinDescent=100);font.setupPost();font.setupMaxp();font.font.flavor='woff2';out=ROOT/'assets/number-garden-written-v1.woff2';font.save(out);print('Built',out.name,out.stat().st_size,'bytes')
