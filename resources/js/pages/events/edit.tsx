import { useState } from 'react';
import type { SVGProps } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { type Event } from '@/types';

// --- SHADCN COMPONENTS ---
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// --- ICONS ---
import {
    Calendar,
    MapPin,
    Users,
    Type,
    AlignLeft,
    ArrowLeft,
    Save,
    Trash2,
    UploadCloud,
} from 'lucide-react';

/* ========================
   TYPES
======================== */
type EditProps = {
    event: Event;
};

/* ========================
   COMPONENT
======================== */
export default function Edit({ event }: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Events', href: '/events' },
        { title: 'Edit Event', href: '#' },
    ];

    const [imagePreview, setImagePreview] = useState<string | null>(
        event.image ? `/storage/${event.image}` : null
    );

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        title: event.title,
        description: event.description ?? '',
        event_date: event.event_date,
        location: event.location ?? '',
        max_participants: event.max_participants?.toString() ?? '',
        status: event.status,
        image: null as File | null,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setData('image', file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(event.image ? `/storage/${event.image}` : null);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/events/${event.id}`, { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit - ${event.title}`} />

            <div className="flex flex-1 flex-col p-4 md:p-8 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href="/events"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-2 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke Daftar Event
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Edit Event
                    </h1>
                </div>

                <form
                    onSubmit={submit}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informasi Dasar</CardTitle>
                                <CardDescription>
                                    Detail konten dan deskripsi acara
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Type className="h-4 w-4" />
                                        Nama Event
                                    </Label>
                                    <Input
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                    />
                                    {errors.title && (
                                        <p className="text-xs text-destructive">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <AlignLeft className="h-4 w-4" />
                                        Deskripsi
                                    </Label>
                                    <Textarea
                                        rows={8}
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Lokasi & Kapasitas</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Lokasi
                                    </Label>
                                    <Input
                                        value={data.location}
                                        onChange={(e) =>
                                            setData(
                                                'location',
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Batas Peserta
                                    </Label>
                                    <Input
                                        type="number"
                                        value={data.max_participants}
                                        onChange={(e) =>
                                            setData(
                                                'max_participants',
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status & Jadwal</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Status
                                    </Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(v) =>
                                            setData('status', v as 'open' | 'closed')
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="open">
                                                Open
                                            </SelectItem>
                                            <SelectItem value="closed">
                                                Closed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Waktu Acara
                                    </Label>
                                    <Input
                                        type="datetime-local"
                                        value={data.event_date}
                                        onChange={(e) =>
                                            setData(
                                                'event_date',
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Event Banner</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="relative aspect-video rounded-lg border-2 border-dashed overflow-hidden">
                                        {imagePreview ? (
                                            <>
                                                <img
                                                    src={imagePreview}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center gap-2">
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        onClick={() =>
                                                            document
                                                                .getElementById(
                                                                    'image-upload'
                                                                )
                                                                ?.click()
                                                        }
                                                    >
                                                        Ubah
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={removeImage}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <label
                                                htmlFor="image-upload"
                                                className="flex flex-col items-center justify-center h-full cursor-pointer"
                                            >
                                                <UploadCloud className="h-8 w-8 mb-2" />
                                                <span className="text-xs">
                                                    Upload Banner
                                                </span>
                                            </label>
                                        )}
                                        <input
                                            id="image-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

/* ========================
   ICON
======================== */
const CheckCircle2 = (props: SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);
