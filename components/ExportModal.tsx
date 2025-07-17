import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Copy, Download, FileText, Palette, Code } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ExportModalProps {
  designSystem: any;
  figmaVariables: string;
  cssVariables: string;
}

export function ExportModal({ designSystem, figmaVariables, cssVariables }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState('figma');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  const generateTailwindConfig = () => {
    const colors: any = {};
    
    Object.entries(designSystem.colors).forEach(([colorName, shades]: [string, any]) => {
      colors[colorName] = {};
      Object.entries(shades).forEach(([shade, value]) => {
        colors[colorName][shade] = value;
      });
    });

    const config = {
      theme: {
        extend: {
          colors,
          fontFamily: {
            sans: [designSystem.fontFamily]
          },
          fontSize: designSystem.typography,
          spacing: designSystem.spacing.reduce((acc: any, space: string, index: number) => {
            acc[index + 1] = space;
            return acc;
          }, {}),
          borderRadius: designSystem.borderRadius.reduce((acc: any, radius: string, index: number) => {
            acc[index] = radius;
            return acc;
          }, {})
        }
      }
    };

    return JSON.stringify(config, null, 2);
  };

  const generateSCSSVariables = () => {
    let scss = `// ${designSystem.name} - Design System Variables\n\n`;
    
    // Colors
    scss += '// Colors\n';
    Object.entries(designSystem.colors).forEach(([colorName, shades]: [string, any]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        scss += `$${colorName}-${shade}: ${value};\n`;
      });
    });
    
    // Typography
    scss += '\n// Typography\n';
    scss += `$font-family-base: ${designSystem.fontFamily};\n`;
    Object.entries(designSystem.typography).forEach(([size, props]: [string, any]) => {
      scss += `$font-size-${size}: ${props.size};\n`;
      scss += `$line-height-${size}: ${props.lineHeight};\n`;
      scss += `$font-weight-${size}: ${props.weight};\n`;
    });
    
    // Spacing
    scss += '\n// Spacing\n';
    designSystem.spacing.forEach((space: string, index: number) => {
      scss += `$spacing-${index + 1}: ${space};\n`;
    });
    
    // Border Radius
    scss += '\n// Border Radius\n';
    designSystem.borderRadius.forEach((radius: string, index: number) => {
      scss += `$border-radius-${index}: ${radius};\n`;
    });
    
    return scss;
  };

  const generateTokensStudio = () => {
    const tokens = {
      global: {
        colors: {},
        typography: {},
        spacing: {},
        borderRadius: {}
      }
    };

    // Colors
    Object.entries(designSystem.colors).forEach(([colorName, shades]: [string, any]) => {
      (tokens.global.colors as any)[colorName] = {};
      Object.entries(shades).forEach(([shade, value]) => {
        (tokens.global.colors as any)[colorName][shade] = {
          value,
          type: 'color'
        };
      });
    });

    // Typography
    Object.entries(designSystem.typography).forEach(([size, props]: [string, any]) => {
      (tokens.global.typography as any)[size] = {
        value: {
          fontSize: props.size,
          lineHeight: props.lineHeight,
          fontWeight: props.weight,
          fontFamily: designSystem.fontFamily
        },
        type: 'typography'
      };
    });

    // Spacing
    designSystem.spacing.forEach((space: string, index: number) => {
      (tokens.global.spacing as any)[index + 1] = {
        value: space,
        type: 'spacing'
      };
    });

    // Border Radius
    designSystem.borderRadius.forEach((radius: string, index: number) => {
      (tokens.global.borderRadius as any)[index] = {
        value: radius,
        type: 'borderRadius'
      };
    });

    return JSON.stringify(tokens, null, 2);
  };

  const formats = [
    { id: 'figma', name: 'Figma Variables', content: figmaVariables, filename: 'figma-variables.json' },
    { id: 'css', name: 'CSS Variables', content: cssVariables, filename: 'design-system.css' },
    { id: 'tailwind', name: 'Tailwind Config', content: generateTailwindConfig(), filename: 'tailwind.config.js' },
    { id: 'scss', name: 'SCSS Variables', content: generateSCSSVariables(), filename: 'variables.scss' },
    { id: 'tokens', name: 'Tokens Studio', content: generateTokensStudio(), filename: 'tokens.json' }
  ];

  const currentFormat = formats.find(f => f.id === exportFormat);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg">
          <Download className="mr-2 h-4 w-4" />
          Export Design System
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Export {designSystem.name}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={exportFormat} onValueChange={setExportFormat} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="figma" className="flex items-center gap-1">
              <Palette className="h-3 w-3" />
              Figma
            </TabsTrigger>
            <TabsTrigger value="css" className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              CSS
            </TabsTrigger>
            <TabsTrigger value="tailwind" className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Tailwind
            </TabsTrigger>
            <TabsTrigger value="scss" className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              SCSS
            </TabsTrigger>
            <TabsTrigger value="tokens" className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Tokens
            </TabsTrigger>
          </TabsList>
          
          {formats.map(format => (
            <TabsContent key={format.id} value={format.id} className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{format.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(format.content)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => downloadFile(format.content, format.filename)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={format.content}
                    readOnly
                    className="font-mono text-sm min-h-96 resize-none"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
