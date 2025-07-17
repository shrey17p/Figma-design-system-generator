import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Copy, Eye, Code } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ComponentConfig {
  type: 'button' | 'card' | 'input' | 'badge' | 'alert';
  variant: string;
  size: string;
  text: string;
  props: Record<string, any>;
}

const componentTemplates = {
  button: {
    variants: ['primary', 'secondary', 'outline', 'destructive'],
    sizes: ['sm', 'md', 'lg'],
    defaultText: 'Click me',
    props: ['disabled', 'loading']
  },
  card: {
    variants: ['default', 'outlined'],
    sizes: ['sm', 'md', 'lg'],
    defaultText: 'Card Title',
    props: ['shadow', 'hover']
  },
  input: {
    variants: ['default', 'filled'],
    sizes: ['sm', 'md', 'lg'],
    defaultText: 'Enter text...',
    props: ['disabled', 'error']
  },
  badge: {
    variants: ['default', 'secondary', 'destructive', 'outline'],
    sizes: ['sm', 'md', 'lg'],
    defaultText: 'Badge',
    props: ['rounded']
  },
  alert: {
    variants: ['default', 'destructive', 'warning', 'success'],
    sizes: ['md'],
    defaultText: 'This is an alert message',
    props: ['dismissible']
  }
};

export function ComponentGenerator() {
  const [selectedComponent, setSelectedComponent] = useState<ComponentConfig>({
    type: 'button',
    variant: 'primary',
    size: 'md',
    text: 'Click me',
    props: {}
  });

  const [generatedComponents, setGeneratedComponents] = useState<ComponentConfig[]>([]);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  const generateComponent = () => {
    const newComponent = { ...selectedComponent };
    setGeneratedComponents(prev => [...prev, newComponent]);
    toast.success(`${selectedComponent.type} component generated!`);
  };

  const updateComponent = (field: keyof ComponentConfig, value: any) => {
    setSelectedComponent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateProp = (propName: string, value: boolean) => {
    setSelectedComponent(prev => ({
      ...prev,
      props: {
        ...prev.props,
        [propName]: value
      }
    }));
  };

  const generateComponentCode = (component: ComponentConfig) => {
    const props = Object.entries(component.props)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)
      .join(' ');

    switch (component.type) {
      case 'button':
        return `<Button variant="${component.variant}" size="${component.size}" ${props}>
  ${component.text}
</Button>`;
      
      case 'card':
        return `<Card className="${component.size === 'lg' ? 'p-6' : 'p-4'}" ${props}>
  <CardHeader>
    <CardTitle>${component.text}</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here...
  </CardContent>
</Card>`;
      
      case 'input':
        return `<Input 
  placeholder="${component.text}"
  size="${component.size}"
  ${props}
/>`;
      
      case 'badge':
        return `<Badge variant="${component.variant}" ${props}>
  ${component.text}
</Badge>`;
      
      case 'alert':
        return `<Alert variant="${component.variant}" ${props}>
  <AlertDescription>
    ${component.text}
  </AlertDescription>
</Alert>`;
      
      default:
        return '';
    }
  };

  const copyCode = (component: ComponentConfig) => {
    const code = generateComponentCode(component);
    navigator.clipboard.writeText(code);
    toast.success('Component code copied!');
  };

  const renderPreview = (component: ComponentConfig) => {
    const baseClasses = "rounded-lg transition-all";
    
    switch (component.type) {
      case 'button':
        const buttonVariants = {
          primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
          secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
          outline: 'border border-border bg-background hover:bg-accent',
          destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
        };
        const buttonSizes = {
          sm: 'px-3 py-1.5 text-sm',
          md: 'px-4 py-2',
          lg: 'px-6 py-3 text-lg'
        };
        return (
          <button 
            className={`${baseClasses} ${buttonVariants[component.variant as keyof typeof buttonVariants]} ${buttonSizes[component.size as keyof typeof buttonSizes]} ${component.props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={component.props.disabled}
          >
            {component.props.loading ? 'Loading...' : component.text}
          </button>
        );
      
      case 'card':
        const cardSizes = {
          sm: 'p-3',
          md: 'p-4',
          lg: 'p-6'
        };
        return (
          <div className={`${baseClasses} border border-border bg-card ${cardSizes[component.size as keyof typeof cardSizes]} ${component.props.hover ? 'hover:shadow-md' : ''} ${component.props.shadow ? 'shadow-sm' : ''}`}>
            <h4 className="mb-2 text-card-foreground">{component.text}</h4>
            <p className="text-sm text-muted-foreground">This is a sample card component with customizable content.</p>
          </div>
        );
      
      case 'input':
        const inputSizes = {
          sm: 'px-2 py-1 text-sm',
          md: 'px-3 py-2',
          lg: 'px-4 py-3 text-lg'
        };
        return (
          <input 
            className={`${baseClasses} border border-border bg-background ${inputSizes[component.size as keyof typeof inputSizes]} ${component.props.error ? 'border-destructive' : ''} ${component.props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder={component.text}
            disabled={component.props.disabled}
          />
        );
      
      case 'badge':
        const badgeVariants = {
          default: 'bg-primary text-primary-foreground',
          secondary: 'bg-secondary text-secondary-foreground',
          destructive: 'bg-destructive text-destructive-foreground',
          outline: 'border border-border text-foreground'
        };
        const badgeSizes = {
          sm: 'px-2 py-0.5 text-xs',
          md: 'px-2.5 py-0.5 text-sm',
          lg: 'px-3 py-1'
        };
        return (
          <span className={`inline-flex items-center ${baseClasses} ${badgeVariants[component.variant as keyof typeof badgeVariants]} ${badgeSizes[component.size as keyof typeof badgeSizes]} ${component.props.rounded ? 'rounded-full' : ''}`}>
            {component.text}
          </span>
        );
      
      case 'alert':
        const alertVariants = {
          default: 'bg-accent text-accent-foreground border-border',
          destructive: 'bg-destructive/10 text-destructive border-destructive/20',
          warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
          success: 'bg-green-50 text-green-800 border-green-200'
        };
        return (
          <div className={`${baseClasses} border p-4 ${alertVariants[component.variant as keyof typeof alertVariants]}`}>
            <p>{component.text}</p>
            {component.props.dismissible && (
              <button className="ml-2 text-sm underline">Dismiss</button>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Component Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Component Type</Label>
              <select 
                value={selectedComponent.type}
                onChange={(e) => {
                  const type = e.target.value as ComponentConfig['type'];
                  const template = componentTemplates[type];
                  updateComponent('type', type);
                  updateComponent('variant', template.variants[0]);
                  updateComponent('size', template.sizes[0]);
                  updateComponent('text', template.defaultText);
                  updateComponent('props', {});
                }}
                className="w-full p-2 border border-border rounded-md bg-background"
              >
                {Object.keys(componentTemplates).map(type => (
                  <option key={type} value={type} className="capitalize">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Variant</Label>
                <select 
                  value={selectedComponent.variant}
                  onChange={(e) => updateComponent('variant', e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  {componentTemplates[selectedComponent.type].variants.map(variant => (
                    <option key={variant} value={variant} className="capitalize">
                      {variant}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Size</Label>
                <select 
                  value={selectedComponent.size}
                  onChange={(e) => updateComponent('size', e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  {componentTemplates[selectedComponent.type].sizes.map(size => (
                    <option key={size} value={size}>
                      {size.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Text Content</Label>
              <Input
                value={selectedComponent.text}
                onChange={(e) => updateComponent('text', e.target.value)}
                placeholder="Enter component text"
              />
            </div>

            <div className="space-y-3">
              <Label>Properties</Label>
              <div className="space-y-2">
                {componentTemplates[selectedComponent.type].props.map(prop => (
                  <div key={prop} className="flex items-center justify-between">
                    <Label className="capitalize">{prop}</Label>
                    <Switch
                      checked={selectedComponent.props[prop] || false}
                      onCheckedChange={(checked) => updateProp(prop, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={generateComponent} className="w-full">
              Generate Component
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Preview</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'preview' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('preview')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  variant={viewMode === 'code' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('code')}
                >
                  <Code className="h-4 w-4 mr-1" />
                  Code
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'preview' ? (
              <div className="flex items-center justify-center p-8 border border-border rounded-lg bg-background">
                {renderPreview(selectedComponent)}
              </div>
            ) : (
              <div className="relative">
                <Textarea
                  value={generateComponentCode(selectedComponent)}
                  readOnly
                  className="font-mono text-sm min-h-32"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyCode(selectedComponent)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {generatedComponents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Components ({generatedComponents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedComponents.map((component, index) => (
                <div key={index} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="capitalize">
                      {component.type}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyCode(component)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-muted rounded">
                    {renderPreview(component)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {component.variant} • {component.size}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
