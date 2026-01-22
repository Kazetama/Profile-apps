import { Head, useForm, usePage } from '@inertiajs/react'
import type { PageProps as InertiaPageProps } from '@inertiajs/core'
import {
    Calendar,
    MapPin,
    Users,
    School,
    User,
    Phone,
    Mail,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
} from 'lucide-react'

// --- SHADCN COMPONENTS ---
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from '@/components/ui/alert'
import type { PublicEvent } from '@/types'

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------
interface FlashMessage {
    success?: string
    error?: string
}

interface PageProps extends InertiaPageProps {
    flash: FlashMessage
}

// -----------------------------------------------------------------------------
// PAGE
// -----------------------------------------------------------------------------
export default function EventShow({ event }: { event: PublicEvent }) {
    const { flash } = usePage<PageProps>().props

    const { data, setData, post, processing, errors, reset } = useForm({
        full_name: '',
        school_origin: '',
        phone: '',
        email: '',
    })

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        post(`/events/${event.id}/register`, {
            onSuccess: () => reset(),
        })
    }

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <Head title={event.title} />

            {/* HERO SECTION */}
            <div className="relative h-[300px] w-full overflow-hidden bg-slate-900 md:h-[400px]">
                {event.image ? (
                    <img
                        src={`/storage/${event.image}`}
                        alt={event.title}
                        className="h-full w-full object-cover opacity-60"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900" />
                )}

                <div className="absolute inset-0 flex items-end">
                    <div className="mx-auto w-full max-w-4xl p-6 text-white md:p-10">
                        <Badge
                            variant={
                                event.status === 'open'
                                    ? 'default'
                                    : 'destructive'
                            }
                            className="mb-4"
                        >
                            {event.status === 'open'
                                ? 'Registration Open'
                                : 'Closed'}
                        </Badge>
                        <h1 className="mb-4 text-3xl font-extrabold tracking-tight drop-shadow-md md:text-5xl">
                            {event.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="relative z-10 mx-auto -mt-10 max-w-4xl px-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* LEFT: EVENT DETAIL */}
                    <div className="space-y-6 lg:col-span-7">
                        <Card className="border-none shadow-xl shadow-slate-200/50">
                            <CardContent className="space-y-6 p-6 md:p-8">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-slate-800">
                                        Tentang Event
                                    </h3>
                                    <p className="italic leading-relaxed text-slate-600">
                                        &quot;
                                        {event.description ||
                                            'Tidak ada deskripsi untuk acara ini.'}
                                        &quot;
                                    </p>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <InfoItem
                                        icon={<Calendar className="h-5 w-5" />}
                                        label="Tanggal & Waktu"
                                        value={event.event_date ?? '-'}
                                    />
                                    <InfoItem
                                        icon={<MapPin className="h-5 w-5" />}
                                        label="Lokasi"
                                        value={event.location ?? '-'}
                                    />
                                    <InfoItem
                                        icon={<Users className="h-5 w-5" />}
                                        label="Kapasitas"
                                        value={`${event.registered} / ${event.max_participants} Peserta`}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT: REGISTRATION */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-6 space-y-4">
                            {flash?.success && (
                                <Alert className="border-green-200 bg-green-50 text-green-800">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertTitle>Berhasil</AlertTitle>
                                    <AlertDescription>
                                        {flash.success}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {flash?.error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Gagal</AlertTitle>
                                    <AlertDescription>
                                        {flash.error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {event.is_full && (
                                <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                                    <AlertCircle className="h-4 w-4 text-amber-600" />
                                    <AlertTitle>Kuota Penuh</AlertTitle>
                                    <AlertDescription>
                                        Pendaftaran untuk event ini telah
                                        ditutup.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {!flash?.success &&
                            event.status === 'open' &&
                            !event.is_full ? (
                                <Card className="border-none shadow-2xl shadow-primary/10">
                                    <CardHeader className="pb-4 text-center">
                                        <CardTitle className="text-2xl">
                                            Daftar Sekarang
                                        </CardTitle>
                                        <CardDescription>
                                            Isi data diri Anda dengan benar
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form
                                            onSubmit={submit}
                                            className="space-y-4"
                                        >
                                            <FormField
                                                label="Nama Lengkap"
                                                icon={<User className="h-4 w-4" />}
                                                value={data.full_name}
                                                onChange={(v) =>
                                                    setData('full_name', v)
                                                }
                                                error={errors.full_name}
                                                placeholder="John Doe"
                                            />

                                            <FormField
                                                label="Asal Sekolah"
                                                icon={<School className="h-4 w-4" />}
                                                value={data.school_origin}
                                                onChange={(v) =>
                                                    setData(
                                                        'school_origin',
                                                        v,
                                                    )
                                                }
                                                error={errors.school_origin}
                                                placeholder="SMA Negeri 1..."
                                            />

                                            <FormField
                                                label="No WhatsApp"
                                                icon={<Phone className="h-4 w-4" />}
                                                value={data.phone}
                                                onChange={(v) =>
                                                    setData('phone', v)
                                                }
                                                error={errors.phone}
                                                placeholder="0812..."
                                            />

                                            <FormField
                                                label="Email"
                                                type="email"
                                                icon={<Mail className="h-4 w-4" />}
                                                value={data.email}
                                                onChange={(v) =>
                                                    setData('email', v)
                                                }
                                                error={errors.email}
                                                placeholder="john@example.com"
                                            />

                                            <Button
                                                type="submit"
                                                className="w-full font-bold"
                                                size="lg"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Memproses...'
                                                    : 'Kirim Pendaftaran'}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="border-2 border-dashed bg-slate-50">
                                    <CardContent className="space-y-3 p-8 text-center">
                                        <AlertCircle className="mx-auto h-6 w-6 text-slate-500" />
                                        <h3 className="font-bold text-slate-700">
                                            Pendaftaran Tidak Tersedia
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Event sudah penuh atau ditutup
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// -----------------------------------------------------------------------------
// SMALL COMPONENTS (STRICT TYPING)
// -----------------------------------------------------------------------------
function InfoItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode
    label: string
    value: string
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                {icon}
            </div>
            <div>
                <p className="text-xs font-medium uppercase text-slate-500">
                    {label}
                </p>
                <p className="text-sm font-semibold text-slate-700">
                    {value}
                </p>
            </div>
        </div>
    )
}

function FormField({
    label,
    icon,
    value,
    onChange,
    error,
    placeholder,
    type = 'text',
}: {
    label: string
    icon: React.ReactNode
    value: string
    onChange: (value: string) => void
    error?: string
    placeholder?: string
    type?: string
}) {
    return (
        <div className="space-y-2">
            <Label className="text-sm font-semibold">{label}</Label>
            <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">
                    {icon}
                </span>
                <Input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    className="pl-10"
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
            {error && (
                <p className="text-xs font-medium text-destructive">
                    {error}
                </p>
            )}
        </div>
    )
}
