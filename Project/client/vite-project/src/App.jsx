import {
  useEffect,
  useMemo,
  useState,
} from "react";

import toast, {
  Toaster,
} from "react-hot-toast";

import {
  Search,
  MapPin,
  Mail,
  Globe,
  Phone,
  Building2,
  RefreshCw,
  ExternalLink,
  Users,
  CheckCircle2,
  Database,
} from "lucide-react";

import {
  findBuyers,
  getBuyers,
} from "./services/api";
import "./index.css";


function App() {
  const [keyword, setKeyword] =
    useState("home decor stores");

  const [location, setLocation] =
    useState("New York, USA");

  const [buyers, setBuyers] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [
    loadingSaved,
    setLoadingSaved,
  ] = useState(false);

  // ---------------------------
  // Load saved buyers
  // ---------------------------

  const loadBuyers = async () => {
    try {
      setLoadingSaved(true);

      const data =
        await getBuyers();

      setBuyers(data.buyers || []);
    } catch (error) {
      toast.error(
        "Unable to load buyers"
      );
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    loadBuyers();
  }, []);

  // ---------------------------
  // Find new buyers
  // ---------------------------

  const handleFindBuyers =
    async () => {
      if (!keyword.trim()) {
        toast.error(
          "Enter a keyword"
        );

        return;
      }

      if (!location.trim()) {
        toast.error(
          "Enter a location"
        );

        return;
      }

      try {
        setLoading(true);

        const data =
          await findBuyers({
            keyword,
            location,
          });

        setBuyers(
          data.buyers || []
        );

        toast.success(
          `${data.count} buyers found`
        );
      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Failed to find buyers"
        );
      } finally {
        setLoading(false);
      }
    };

  // ---------------------------
  // Statistics
  // ---------------------------

  const statistics =
    useMemo(() => {
      const total =
        buyers.length;

      const withEmail =
        buyers.filter(
          (buyer) => buyer.email
        ).length;

      const withWebsite =
        buyers.filter(
          (buyer) => buyer.website
        ).length;

      return {
        total,
        withEmail,
        withWebsite,
      };
    }, [buyers]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />

      {/* Header */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Building2 size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                DecorFinder
              </h1>

              <p className="text-xs text-slate-500">
                US Home Decor Lead Finder
              </p>
            </div>
          </div>

          <button
            onClick={loadBuyers}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw
              size={16}
              className={
                loadingSaved
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Hero */}

        <section className="mb-8 rounded-2xl bg-slate-900 px-8 py-10 text-white shadow-sm">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Google Places powered
            </div>

            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Find home decor
              businesses in the US.
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
              Discover businesses, websites,
              phone numbers and publicly
              available contact emails.
            </p>
          </div>
        </section>

        {/* Search Card */}

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900">
              Search businesses
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Search for potential home decor
              buyers by industry and location.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            {/* Keyword */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Industry / Keyword
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={keyword}
                  onChange={(e) =>
                    setKeyword(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter"
                    ) {
                      handleFindBuyers();
                    }
                  }}
                  placeholder="e.g. home decor stores"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                />
              </div>
            </div>

            {/* Location */}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Location
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={location}
                  onChange={(e) =>
                    setLocation(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter"
                    ) {
                      handleFindBuyers();
                    }
                  }}
                  placeholder="e.g. New York, USA"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                />
              </div>
            </div>

            {/* Button */}

            <div className="flex items-end">
              <button
                onClick={
                  handleFindBuyers
                }
                disabled={loading}
                className="flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
              >
                {loading ? (
                  <>
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />

                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={17} />

                    Find Buyers
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Statistics */}

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={
              <Users size={20} />
            }
            title="Total Buyers"
            value={
              statistics.total
            }
          />

          <StatCard
            icon={
              <Mail size={20} />
            }
            title="With Email"
            value={
              statistics.withEmail
            }
          />

          <StatCard
            icon={
              <Globe size={20} />
            }
            title="With Website"
            value={
              statistics.withWebsite
            }
          />
        </section>

        {/* Results */}

        <section>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Buyer Leads
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {buyers.length} businesses
                available
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Database size={15} />

              MongoDB
            </div>
          </div>

          {loading ? (
            <LoadingState />
          ) : buyers.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-4">
              {buyers.map(
                (buyer) => (
                  <BuyerCard
                    key={
                      buyer._id
                    }
                    buyer={
                      buyer
                    }
                  />
                )
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}


// --------------------------------
// Stat Card
// --------------------------------

function StatCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>

        <CheckCircle2
          size={17}
          className="text-emerald-500"
        />
      </div>

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}


// --------------------------------
// Buyer Card
// --------------------------------

function BuyerCard({
  buyer,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Company */}

        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Building2 size={21} />
          </div>

          <div className="min-w-0">
            <h4 className="truncate text-base font-semibold text-slate-900">
              {buyer.companyName}
            </h4>

            <div className="mt-1 flex items-start gap-1.5 text-sm text-slate-500">
              <MapPin
                size={15}
                className="mt-0.5 shrink-0"
              />

              <span>
                {buyer.address ||
                  "Address not available"}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Info */}

        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[520px]">
          <ContactItem
            icon={
              <Mail size={16} />
            }
            label="Email"
            value={
              buyer.email
            }
          />

          <ContactItem
            icon={
              <Phone size={16} />
            }
            label="Phone"
            value={
              buyer.phone
            }
          />

          <ContactItem
            icon={
              <Globe size={16} />
            }
            label="Website"
            value={
              buyer.website
            }
            link
          />

          <ContactItem
            icon={
              <ExternalLink
                size={16}
              />
            }
            label="Google Maps"
            value={
              buyer.googleMapsUrl
                ? "View location"
                : null
            }
            link
            href={
              buyer.googleMapsUrl
            }
          />
        </div>
      </div>
    </article>
  );
}


// --------------------------------
// Contact Item
// --------------------------------

function ContactItem({
  icon,
  label,
  value,
  link = false,
  href,
}) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
        {icon}

        {label}
      </div>

      {!value ? (
        <span className="text-sm text-slate-400">
          Not available
        </span>
      ) : link ? (
        <a
          href={
            href || value
          }
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 truncate text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline"
        >
          {value}

          <ExternalLink
            size={12}
            className="shrink-0"
          />
        </a>
      ) : (
        <span className="block truncate text-sm font-medium text-slate-700">
          {value}
        </span>
      )}
    </div>
  );
}


// --------------------------------
// Loading
// --------------------------------

function LoadingState() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map(
        (item) => (
          <div
            key={item}
            className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
          >
            <div className="h-5 w-48 rounded bg-slate-200" />

            <div className="mt-4 h-4 w-72 rounded bg-slate-100" />

            <div className="mt-6 h-4 w-full rounded bg-slate-100" />
          </div>
        )
      )}
    </div>
  );
}


// --------------------------------
// Empty
// --------------------------------

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <Search
          size={24}
          className="text-slate-500"
        />
      </div>

      <h4 className="mt-4 text-base font-semibold text-slate-900">
        No buyers found yet
      </h4>

      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        Search for a home decor business
        and the results will appear here.
      </p>
    </div>
  );
}

export default App;