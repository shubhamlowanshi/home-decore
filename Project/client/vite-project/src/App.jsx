import {useEffect,useMemo,useState,} from "react";

import toast, {Toaster,} from "react-hot-toast";

import { Search,MapPin,Mail, Globe,Phone,Building2,  RefreshCw,  ExternalLink,  Users,CheckCircle2,  Database,} from "lucide-react";

import {findBuyers,getBuyers,} from "./services/api";

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

  // =========================
  // Load Saved Buyers
  // =========================

  const loadBuyers = async () => {
    try {
      setLoadingSaved(true);

      const data =
        await getBuyers();

      setBuyers(
        data.buyers || []
      );
    } catch (error) {
      console.error(error);

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

  // =========================
  // Find Buyers
  // =========================

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

  // =========================
  // Statistics
  // =========================

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

      {/* ================= HEADER ================= */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">

          {/* Logo */}

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white sm:h-11 sm:w-11">
              <Building2
                size={20}
              />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                DecorFinder
              </h1>

              <p className="hidden text-xs text-slate-500 sm:block">
                US Home Decor Lead Finder
              </p>
            </div>
          </div>

          {/* Refresh */}

          <button
            onClick={loadBuyers}
            disabled={loadingSaved}
            className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 sm:px-4"
          >
            <RefreshCw
              size={15}
              className={
                loadingSaved
                  ? "animate-spin"
                  : ""
              }
            />

            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>
        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 sm:py-8">

        {/* ================= HERO ================= */}

        <section className="mb-5 overflow-hidden rounded-2xl bg-slate-900 px-5 py-7 text-white shadow-sm sm:mb-8 sm:px-8 sm:py-10">

          <div className="max-w-3xl">

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[11px] text-slate-300 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 sm:h-2 sm:w-2" />

              Google Places powered
            </div>

            <h2 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
              Find home decor
              businesses in the US.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Discover businesses, websites,
              phone numbers and publicly
              available contact emails.
            </p>

          </div>
        </section>

        {/* ================= SEARCH ================= */}

        <section className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:mb-8 sm:p-6">

          <div className="mb-5">
            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
              Search businesses
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              Search potential home decor
              businesses by keyword and location.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">

            {/* Keyword */}

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-700 sm:text-sm">
                Industry / Keyword
              </label>

              <div className="relative">

                <Search
                  size={17}
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
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                />

              </div>
            </div>

            {/* Location */}

            <div>
              <label className="mb-2 block text-xs font-medium text-slate-700 sm:text-sm">
                Location
              </label>

              <div className="relative">

                <MapPin
                  size={17}
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
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
                />

              </div>
            </div>

            {/* Button */}

            <div className="flex items-end md:col-span-2 lg:col-span-1">

              <button
                onClick={
                  handleFindBuyers
                }
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
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

        {/* ================= STATS ================= */}

        <section className="mb-5 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-3 sm:gap-4">

          <StatCard
            icon={
              <Users size={19} />
            }
            title="Total Buyers"
            value={
              statistics.total
            }
          />

          <StatCard
            icon={
              <Mail size={19} />
            }
            title="With Email"
            value={
              statistics.withEmail
            }
          />

          <StatCard
            icon={
              <Globe size={19} />
            }
            title="With Website"
            value={
              statistics.withWebsite
            }
          />

        </section>

        {/* ================= RESULTS ================= */}

        <section>

          <div className="mb-4 flex items-end justify-between gap-3">

            <div>
              <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                Buyer Leads
              </h3>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                {buyers.length} businesses
                available
              </p>
            </div>

            <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
              <Database size={14} />
              MongoDB
            </div>

          </div>

          {loading ? (
            <LoadingState />
          ) : buyers.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-3 sm:gap-4">
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


// =========================
// STAT CARD
// =========================

function StatCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

      <div className="mb-3 flex items-center justify-between sm:mb-4">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 sm:h-10 sm:w-10">
          {icon}
        </div>

        <CheckCircle2
          size={16}
          className="text-emerald-500"
        />

      </div>

      <p className="text-xs text-slate-500 sm:text-sm">
        {title}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
        {value}
      </p>

    </div>
  );
}


// =========================
// BUYER CARD
// =========================

function BuyerCard({
  buyer,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-5">

      {/* Company */}

      <div className="flex min-w-0 items-start gap-3 sm:gap-4">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 sm:h-12 sm:w-12">
          <Building2
            size={19}
          />
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <h4 className="max-w-full truncate text-sm font-semibold text-slate-900 sm:text-base">
              {buyer.companyName}
            </h4>

            {buyer.email && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 sm:text-[11px]">
                Email found
              </span>
            )}

          </div>

          <div className="mt-1.5 flex items-start gap-1.5 text-xs leading-5 text-slate-500 sm:text-sm">

            <MapPin
              size={14}
              className="mt-0.5 shrink-0"
            />

            <span className="break-words">
              {buyer.address ||
                "Address not available"}
            </span>

          </div>

        </div>

      </div>

      {/* Divider */}

      <div className="my-4 border-t border-slate-100" />

      {/* Contact Info */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

        <ContactItem
          icon={
            <Mail size={15} />
          }
          label="Email"
          value={
            buyer.email
          }
        />

        <ContactItem
          icon={
            <Phone size={15} />
          }
          label="Phone"
          value={
            buyer.phone
          }
        />

        <ContactItem
          icon={
            <Globe size={15} />
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
              size={15}
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

    </article>
  );
}


// =========================
// CONTACT ITEM
// =========================

function ContactItem({
  icon,
  label,
  value,
  link = false,
  href,
}) {
  return (
    <div className="min-w-0">

      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-400 sm:text-xs">
        {icon}
        {label}
      </div>

      {!value ? (
        <span className="text-xs text-slate-400 sm:text-sm">
          Not available
        </span>
      ) : link ? (
        <a
          href={
            href || value
          }
          target="_blank"
          rel="noreferrer"
          className="flex min-w-0 items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900 hover:underline sm:text-sm"
        >
          <span className="truncate">
            {value}
          </span>

          <ExternalLink
            size={11}
            className="shrink-0"
          />
        </a>
      ) : (
        <span className="block truncate text-xs font-medium text-slate-700 sm:text-sm">
          {value}
        </span>
      )}

    </div>
  );
}


// =========================
// LOADING
// =========================

function LoadingState() {
  return (
    <div className="grid gap-3 sm:gap-4">

      {[1, 2, 3].map(
        (item) => (
          <div
            key={item}
            className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="h-5 w-40 rounded bg-slate-200 sm:w-48" />

            <div className="mt-4 h-4 w-full max-w-md rounded bg-slate-100" />

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              {[1, 2, 3, 4].map(
                (x) => (
                  <div
                    key={x}
                    className="h-10 rounded bg-slate-100"
                  />
                )
              )}

            </div>
          </div>
        )
      )}

    </div>
  );
}


// =========================
// EMPTY STATE
// =========================

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center sm:px-6 sm:py-16">

      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 sm:h-14 sm:w-14">
        <Search
          size={22}
          className="text-slate-500"
        />
      </div>

      <h4 className="mt-4 text-sm font-semibold text-slate-900 sm:text-base">
        No buyers found yet
      </h4>

      <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500 sm:text-sm">
        Search for a home decor business
        and the results will appear here.
      </p>

    </div>
  );
}

export default App;