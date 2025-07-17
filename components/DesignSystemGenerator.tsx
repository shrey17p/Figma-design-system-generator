import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { Copy, Shuffle, Download, Palette, Type, Ruler, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ExportModal } from './ExportModal';

interface ColorShade {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

interface ColorPalette {
  primary: ColorShade;
  secondary: ColorShade;
  accent: ColorShade;
  neutral: ColorShade;
  success: ColorShade;
  warning: ColorShade;
  error: ColorShade;
}

interface TypographyScale {
  xs: { size: string; lineHeight: string; weight: string };
  sm: { size: string; lineHeight: string; weight: string };
  base: { size: string; lineHeight: string; weight: string };
  lg: { size: string; lineHeight: string; weight: string };
  xl: { size: string; lineHeight: string; weight: string };
  '2xl': { size: string; lineHeight: string; weight: string };
  '3xl': { size: string; lineHeight: string; weight: string };
  '4xl': { size: string; lineHeight: string; weight: string };
  '5xl': { size: string; lineHeight: string; weight: string };
}

interface DesignSystem {
  name: string;
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: string[];
  borderRadius: string[];
  fontFamily: string;
}

const generateColorShade = (baseHue: number, saturation: number): ColorShade => {
  return {
    50: `hsl(${baseHue}, ${Math.max(saturation - 40, 10)}%, 95%)`,
    100: `hsl(${baseHue}, ${Math.max(saturation - 30, 15)}%, 90%)`,
    200: `hsl(${baseHue}, ${Math.max(saturation - 20, 20)}%, 80%)`,
    300: `hsl(${baseHue}, ${Math.max(saturation - 10, 25)}%, 70%)`,
    400: `hsl(${baseHue}, ${saturation}%, 60%)`,
    500: `hsl(${baseHue}, ${saturation}%, 50%)`,
    600: `hsl(${baseHue}, ${saturation}%, 40%)`,
    700: `hsl(${baseHue}, ${Math.min(saturation + 10, 100)}%, 30%)`,
    800: `hsl(${baseHue}, ${Math.min(saturation + 20, 100)}%, 20%)`,
    900: `hsl(${baseHue}, ${Math.min(saturation + 30, 100)}%, 10%)`
  };
};

const generateRandomPalette = (): ColorPalette => {
  const primaryHue = Math.floor(Math.random() * 360);
  const secondaryHue = (primaryHue + 180) % 360;
  const accentHue = (primaryHue + 120) % 360;
  
  return {
    primary: generateColorShade(primaryHue, 70),
    secondary: generateColorShade(secondaryHue, 60),
    accent: generateColorShade(accentHue, 80),
    neutral: generateColorShade(0, 5),
    success: generateColorShade(120, 60),
    warning: generateColorShade(45, 80),
    error: generateColorShade(0, 70)
  };
};

const defaultTypography: TypographyScale = {
  xs: { size: '0.75rem', lineHeight: '1rem', weight: '400' },
  sm: { size: '0.875rem', lineHeight: '1.25rem', weight: '400' },
  base: { size: '1rem', lineHeight: '1.5rem', weight: '400' },
  lg: { size: '1.125rem', lineHeight: '1.75rem', weight: '400' },
  xl: { size: '1.25rem', lineHeight: '1.75rem', weight: '500' },
  '2xl': { size: '1.5rem', lineHeight: '2rem', weight: '500' },
  '3xl': { size: '1.875rem', lineHeight: '2.25rem', weight: '600' },
  '4xl': { size: '2.25rem', lineHeight: '2.5rem', weight: '600' },
  '5xl': { size: '3rem', lineHeight: '1', weight: '700' }
};

const fontFamilies = [
  'Inter, sans-serif',
  'Roboto, sans-serif',
  'Open Sans, sans-serif',
  'Lato, sans-serif',
  'Poppins, sans-serif',
  'Montserrat, sans-serif',
  'Source Sans Pro, sans-serif',
  'Nunito, sans-serif',
  'Playfair Display, serif',
  'Merriweather, serif'
];

export function DesignSystemGenerator() {
  const [designSystem, setDesignSystem] = useState<DesignSystem>({
    name: 'My Design System',
    colors: generateRandomPalette(),
    typography: defaultTypography,
    spacing: ['4px', '8px', '12px', '16px', '20px', '24px', '32px', '40px', '48px', '64px'],
    borderRadius: ['0px', '4px', '8px', '12px', '16px', '24px'],
    fontFamily: fontFamilies[0]
  });

  const [activeTab, setActiveTab] = useState('colors');

  const generateRandomSystem = useCallback(() => {
    const randomName = `Design System ${Math.floor(Math.random() * 1000)}`;
    const randomFont = fontFamilies[Math.floor(Math.random() * fontFamilies.length)];
    
    setDesignSystem({
      name: randomName,
      colors: generateRandomPalette(),
      typography: defaultTypography,
      spacing: ['4px', '8px', '12px', '16px', '20px', '24px', '32px', '40px', '48px', '64px'],
      borderRadius: ['0px', '4px', '8px', '12px', '16px', '24px'],
      fontFamily: randomFont
    });
    
    toast.success('New design system generated!');
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const generateFigmaVariables = () => {
    const variables: any = {};
    
    // Colors
    Object.entries(designSystem.colors).forEach(([colorName, shades]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        variables[`color/${colorName}/${shade}`] = value;
      });
    });
    
    // Typography
    Object.entries(designSystem.typography).forEach(([size, props]) => {
      variables[`typography/${size}/size`] = props.size;
      variables[`typography/${size}/lineHeight`] = props.lineHeight;
      variables[`typography/${size}/weight`] = props.weight;
    });
    
    // Spacing
    designSystem.spacing.forEach((space, index) => {
      variables[`spacing/${index + 1}`] = space;
    });
    
    // Border Radius
    designSystem.borderRadius.forEach((radius, index) => {
      variables[`radius/${index}`] = radius;
    });
    
    variables['font/family'] = designSystem.fontFamily;
    
    return JSON.stringify(variables, null, 2);
  };

  const generateCSS = () => {
    let css = `:root {\n`;
    
    // Colors
    Object.entries(designSystem.colors).forEach(([colorName, shades]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        css += `  --${colorName}-${shade}: ${value};\n`;
      });
    });
    
    // Typography
    Object.entries(designSystem.typography).forEach(([size, props]) => {
      css += `  --text-${size}: ${props.size};\n`;
      css += `  --leading-${size}: ${props.lineHeight};\n`;
      css += `  --weight-${size}: ${props.weight};\n`;
    });
    
    // Spacing
    designSystem.spacing.forEach((space, index) => {
      css += `  --spacing-${index + 1}: ${space};\n`;
    });
    
    // Border Radius
    designSystem.borderRadius.forEach((radius, index) => {
      css += `  --radius-${index}: ${radius};\n`;
    });
    
    css += `  --font-family: ${designSystem.fontFamily};\n`;
    css += `}\n`;
    
    return css;
  };

  const ColorShadeDisplay = ({ colorName, shades }: { colorName: string; shades: ColorShade }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="capitalize font-medium">{colorName}</Label>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            const baseHue = Math.floor(Math.random() * 360);
            const newShades = generateColorShade(baseHue, 70);
            setDesignSystem(prev => ({
              ...prev,
              colors: {
                ...prev.colors,
                [colorName]: newShades
              }
            }));
          }}
        >
          <Shuffle className="h-3 w-3" />
        </Button>
      </div>
      <div className="grid grid-cols-10 gap-1">
        {Object.entries(shades).map(([shade, value]) => (
          <div key={shade} className="group">
            <div
              className="w-full h-12 rounded-lg cursor-pointer border border-border/20 transition-all hover:scale-105 hover:shadow-md"
              style={{ backgroundColor: value }}
              onClick={() => copyToClipboard(value)}
              title={`Click to copy: ${value}`}
            />
            <div className="text-xs text-center text-muted-foreground mt-1 group-hover:text-foreground transition-colors">
              {shade}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const TypographyDisplay = () => (
    <div className="space-y-6">
      {Object.entries(designSystem.typography).map(([size, props]) => (
        <div key={size} className="group flex items-center gap-6 p-4 rounded-lg border border-border/20 hover:border-border/40 transition-all">
          <div className="w-12 text-sm text-muted-foreground font-mono">{size}</div>
          <div
            className="flex-1 transition-all"
            style={{
              fontSize: props.size,
              lineHeight: props.lineHeight,
              fontWeight: props.weight,
              fontFamily: designSystem.fontFamily
            }}
          >
            The quick brown fox jumps over the lazy dog
          </div>
          <div className="text-xs text-muted-foreground min-w-24">
            {props.size} • {props.weight}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => copyToClipboard(`font-size: ${props.size}; line-height: ${props.lineHeight}; font-weight: ${props.weight};`)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );

  const SpacingDisplay = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="font-medium">Spacing Scale</Label>
        <div className="grid grid-cols-2 gap-3">
          {designSystem.spacing.map((space, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-border/20 hover:border-border/40 transition-all group">
              <div className="text-sm text-muted-foreground w-8 font-mono">{index + 1}</div>
              <div
                className="bg-primary/20 rounded transition-all group-hover:bg-primary/30"
                style={{ width: space, height: '20px' }}
              />
              <div className="text-sm font-mono">{space}</div>
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                onClick={() => copyToClipboard(space)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-3">
        <Label className="font-medium">Border Radius</Label>
        <div className="grid grid-cols-3 gap-3">
          {designSystem.borderRadius.map((radius, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-border/20 hover:border-border/40 transition-all group">
              <div
                className="w-10 h-10 bg-primary/20 border border-primary/30 transition-all group-hover:bg-primary/30"
                style={{ borderRadius: radius }}
              />
              <div className="text-sm font-mono">{radius}</div>
              <Button
                size="sm"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                onClick={() => copyToClipboard(radius)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl mb-2">{designSystem.name}</h1>
          <p className="text-muted-foreground text-lg">Professional design system with Figma-like color palettes and typography</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={generateRandomSystem} variant="outline" size="lg">
            <Shuffle className="mr-2 h-4 w-4" />
            Generate Random
          </Button>
          <ExportModal 
            designSystem={designSystem}
            figmaVariables={generateFigmaVariables()}
            cssVariables={generateCSS()}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="spacing" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Spacing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-8 mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Color Palette</CardTitle>
                <div className="flex gap-3">
                  <Input
                    value={designSystem.name}
                    onChange={(e) => setDesignSystem(prev => ({ ...prev, name: e.target.value }))}
                    className="w-56"
                    placeholder="Design System Name"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setDesignSystem(prev => ({ ...prev, colors: generateRandomPalette() }))}
                  >
                    <Shuffle className="h-4 w-4 mr-2" />
                    Shuffle All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {Object.entries(designSystem.colors).map(([colorName, shades]) => (
                <ColorShadeDisplay
                  key={colorName}
                  colorName={colorName}
                  shades={shades}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-lg border border-border/50 space-y-4">
                  <h4 className="font-medium">Primary Actions</h4>
                  <div className="space-y-3">
                    <div
                      className="px-4 py-2 rounded-lg text-center text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: designSystem.colors.primary[500] }}
                    >
                      Primary Button
                    </div>
                    <div
                      className="px-4 py-2 rounded-lg text-center border transition-all hover:opacity-90"
                      style={{ 
                        backgroundColor: designSystem.colors.primary[50],
                        color: designSystem.colors.primary[600],
                        borderColor: designSystem.colors.primary[200]
                      }}
                    >
                      Primary Outline
                    </div>
                  </div>
                </div>
                
                <div className="p-6 rounded-lg border border-border/50 space-y-4">
                  <h4 className="font-medium">Status Colors</h4>
                  <div className="space-y-2">
                    {['success', 'warning', 'error'].map(status => (
                      <div key={status} className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: (designSystem.colors as any)[status][500] }}
                        />
                        <div
                          className="px-3 py-1 rounded text-sm text-white"
                          style={{ backgroundColor: (designSystem.colors as any)[status][500] }}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-lg border border-border/50 space-y-4">
                  <h4 className="font-medium">Neutral Tones</h4>
                  <div className="space-y-2">
                    {['100', '300', '500', '700'].map(shade => (
                      <div key={shade} className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-border/20"
                          style={{ backgroundColor: designSystem.colors.neutral[shade as keyof ColorShade] }}
                        />
                        <div className="text-sm">Neutral {shade}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-8 mt-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Typography Scale</CardTitle>
                <select 
                  value={designSystem.fontFamily}
                  onChange={(e) => setDesignSystem(prev => ({ ...prev, fontFamily: e.target.value }))}
                  className="p-2 border border-border rounded-lg bg-background min-w-48"
                >
                  {fontFamilies.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <TypographyDisplay />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Typography in Context</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8 p-6 rounded-lg border border-border/20" style={{ fontFamily: designSystem.fontFamily }}>
                <div>
                  <h1 style={{ 
                    fontSize: designSystem.typography['4xl'].size, 
                    fontWeight: designSystem.typography['4xl'].weight,
                    lineHeight: designSystem.typography['4xl'].lineHeight
                  }}>
                    Design System Documentation
                  </h1>
                  <p style={{ 
                    fontSize: designSystem.typography.lg.size,
                    color: designSystem.colors.neutral[600],
                    marginTop: '8px'
                  }}>
                    A comprehensive guide to using your design system effectively
                  </p>
                </div>
                
                <div>
                  <h2 style={{ 
                    fontSize: designSystem.typography['2xl'].size, 
                    fontWeight: designSystem.typography['2xl'].weight,
                    lineHeight: designSystem.typography['2xl'].lineHeight
                  }}>
                    Getting Started
                  </h2>
                  <p style={{ 
                    fontSize: designSystem.typography.base.size, 
                    lineHeight: designSystem.typography.base.lineHeight,
                    marginTop: '12px'
                  }}>
                    This design system provides a consistent foundation for building user interfaces. It includes color palettes, typography scales, and spacing guidelines that work together harmoniously.
                  </p>
                </div>
                
                <div>
                  <h3 style={{ 
                    fontSize: designSystem.typography.xl.size, 
                    fontWeight: designSystem.typography.xl.weight,
                    lineHeight: designSystem.typography.xl.lineHeight
                  }}>
                    Implementation Notes
                  </h3>
                  <p style={{ 
                    fontSize: designSystem.typography.sm.size, 
                    color: designSystem.colors.neutral[500],
                    marginTop: '8px'
                  }}>
                    Remember to maintain consistency across all components and maintain proper contrast ratios for accessibility.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spacing" className="space-y-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Spacing &amp; Layout</CardTitle>
            </CardHeader>
            <CardContent>
              <SpacingDisplay />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Layout Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-medium">Card Layout</h4>
                  <div 
                    className="bg-background border rounded-lg shadow-sm transition-all hover:shadow-md"
                    style={{ 
                      padding: designSystem.spacing[5],
                      borderRadius: designSystem.borderRadius[2]
                    }}
                  >
                    <div style={{ marginBottom: designSystem.spacing[3] }}>
                      <h5 className="font-medium">Product Card</h5>
                      <p className="text-sm text-muted-foreground" style={{ marginTop: designSystem.spacing[1] }}>
                        This card demonstrates proper spacing usage
                      </p>
                    </div>
                    <div 
                      className="flex gap-2"
                      style={{ gap: designSystem.spacing[2] }}
                    >
                      <div 
                        className="px-3 py-1 rounded text-xs"
                        style={{ 
                          padding: `${designSystem.spacing[1]} ${designSystem.spacing[2]}`,
                          backgroundColor: designSystem.colors.primary[100],
                          color: designSystem.colors.primary[700]
                        }}
                      >
                        Tag
                      </div>
                      <div 
                        className="px-3 py-1 rounded text-xs"
                        style={{ 
                          padding: `${designSystem.spacing[1]} ${designSystem.spacing[2]}`,
                          backgroundColor: designSystem.colors.secondary[100],
                          color: designSystem.colors.secondary[700]
                        }}
                      >
                        Category
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Button Group</h4>
                  <div 
                    className="flex"
                    style={{ gap: designSystem.spacing[2] }}
                  >
                    <div 
                      className="px-4 py-2 rounded text-white transition-all hover:opacity-90"
                      style={{ 
                        padding: `${designSystem.spacing[2]} ${designSystem.spacing[4]}`,
                        backgroundColor: designSystem.colors.primary[500],
                        borderRadius: designSystem.borderRadius[1]
                      }}
                    >
                      Primary
                    </div>
                    <div 
                      className="px-4 py-2 rounded border transition-all hover:opacity-90"
                      style={{ 
                        padding: `${designSystem.spacing[2]} ${designSystem.spacing[4]}`,
                        borderRadius: designSystem.borderRadius[1],
                        borderColor: designSystem.colors.neutral[300]
                      }}
                    >
                      Secondary
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
