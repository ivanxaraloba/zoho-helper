'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { toast } from 'sonner';
import { TypographyH1 } from '@/components/typography/typography-h1';
import { TypographyMuted } from '@/components/typography/typography-muted';
import { Upload } from 'lucide-react';

export default function FilesPage() {
    const [fileContent, setFileContent] = useState<string>('');
    const [fileStats, setFileStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/files/read', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setFileContent(data.data.content);
            setFileStats(data.data.stats);
            toast.success('File read successfully');
        } catch (error: any) {
            toast.error(error.message);
            setFileContent('');
            setFileStats(null);
        } finally {
            setLoading(false);
        }
    };

    console.log(fileContent);


    return (
        <div className="max-w-screen-xl w-full mx-auto p-12">
            <div className="mb-8">
                <TypographyH1>File Reader</TypographyH1>
                <TypographyMuted>Upload and read file contents</TypographyMuted>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upload File</CardTitle>
                    <CardDescription>Select a file to read its contents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary/70">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4" />
                                <p className="mb-2 text-sm">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Any text file</p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileUpload}
                                accept="text/*,.json,.xml,.csv,.md"
                                disabled={loading}
                            />
                        </label>
                    </div>

                    {fileStats && (
                        <Card>
                            <CardHeader>
                                <CardTitle>File Statistics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-secondary/50 p-4 rounded-lg text-sm">
                                    {JSON.stringify(fileStats, null, 2)}
                                </pre>
                            </CardContent>
                        </Card>
                    )}

                    {fileContent && (
                        <Card>
                            <CardHeader>
                                <CardTitle>File Content</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-secondary/50 p-4 rounded-lg text-sm overflow-auto max-h-[500px]">
                                    {fileContent}
                                </pre>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
