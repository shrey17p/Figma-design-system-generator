import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { DesignSystemGenerator } from './components/DesignSystemGenerator';
import { ComponentGenerator } from './components/ComponentGenerator';
import { Toaster } from './components/ui/sonner';
import { Palette, Layers } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl">Design System Studio</h1>
            <p className="text-muted-foreground text-lg">
              Create, customize, and generate design systems with components
            </p>
          </div>

          <Tabs defaultValue="design-system" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="design-system" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Design System
              </TabsTrigger>
              <TabsTrigger value="components" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Components
              </TabsTrigger>
            </TabsList>

            <TabsContent value="design-system" className="mt-6">
              <DesignSystemGenerator />
            </TabsContent>

            <TabsContent value="components" className="mt-6">
              <ComponentGenerator />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
