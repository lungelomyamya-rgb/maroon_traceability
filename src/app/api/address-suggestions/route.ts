import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/auth';

const provinceValues = new Set([
    'eastern-cape',
    'free-state',
    'gauteng',
    'kwazulu-natal',
    'limpopo',
    'mpumalanga',
    'northern-cape',
    'north-west',
    'western-cape',
]);

type NominatimAddress = {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    state?: string;
    postcode?: string;
};

type NominatimResult = {
    display_name?: string;
    name?: string;
    lat?: string;
    lon?: string;
    address?: NominatimAddress;
};

function cityName(address: NominatimAddress): string {
    const town = address.town || address.village || '';
    if (town) {
        return town;
    }
    return (address.city || '')
        .replace(/\s+(local|metropolitan|district)\s+municipality$/i, '')
        .trim();
}

export async function GET(request:NextRequest) {
    const authResult = await requireAuth(request);
    if (authResult.error) {
        return authResult.error;
    }

    const latitude = request.nextUrl.searchParams.get('lat');
    const longitude = request.nextUrl.searchParams.get('lon');
        if (latitude && longitude && /^-?\d+(\.\d+)?$/.test(latitude) && /^-?\d+(\.\d+)?/.test(longitude)) {
            const reverseUrl = new URL('https://nominatim.openstreetmap.org/reverse');
            reverseUrl.searchParams.set('format', 'json');
            reverseUrl.searchParams.set('addressdetails', '1');
            reverseUrl.searchParams.set('lat', latitude);
            reverseUrl.searchParams.set('lon', longitude);

            const reverseResponse = await fetch(reverseUrl, {
                headers: {
                    Accept: 'application/json',
                    'User-Agent': 'MaroonTraceabilityDemo/1.0 (profile address search)',
                },
            });
            if (!reverseResponse.ok) {
                return NextResponse.json({ postalCode: '' });
            }
            const reverseResult = (await reverseResponse.json()) as NominatimResult;
            return NextResponse.json({ postalCode: reverseResult.address?.postcode ?? '' });
        }

    const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';
    if (query.length < 3) {
        return NextResponse.json({ suggestions: [] });
    }

    const searchUrl = new URL('https://nominatim.openstreetmap.org/search');
    searchUrl.searchParams.set('format', 'json');
    searchUrl.searchParams.set('addressdetails', '1');
    searchUrl.searchParams.set('countrycodes', 'za');
    searchUrl.searchParams.set('limit', '5');
    searchUrl.searchParams.set('q', query);

    const response = await fetch(searchUrl, {
        headers: {
            Accept: 'application/json',
            'User-Agent': 'MaroonTraceabilityDemo/1.0 (profile address search)',
        },
    });

    if (!response.ok) {
        return NextResponse.json({ suggestions: [] });
    }

    const results = (await response.json()) as NominatimResult[];
    const suggestions = results.map((result) => {
        const address = result.address ?? {};
        const road = address.road?.trim() ?? '';
        const houseNumber = address.house_number?.trim() ?? '';
        const street = road
            ? [houseNumber,road].filter(Boolean).join(' ')
            : (result.name || address.suburb || address.village || address.town || query);

        const city = cityName(address);
        const province = (address.state ?? '').toLowerCase().replace(/\s+/g, '-');

        return {
            label: result.display_name || street || query,
            street,
            city,
            postalCode: address.postcode || '',
            province: provinceValues.has(province) ? province : '',
            latitude: result.lat ?? '',
            longitude: result.lon ?? '',
        };
    });

    return NextResponse.json({ suggestions });
}