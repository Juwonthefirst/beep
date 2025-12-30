import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";
import { useCallback, useMemo } from "react";

const useSearchParams = () => {
  const router = useRouter();
  const pathName = usePathname();
  const readOnlySearchParams = useNextSearchParams();
  const searchParamsMap = useMemo(() => {
    const searchParamsMap: Record<string, string> = {};

    const parsedSearchParams = new URLSearchParams(
      readOnlySearchParams.toString()
    );
    parsedSearchParams.forEach((value, key) => {
      searchParamsMap[key] = value;
    });
    return searchParamsMap;
  }, [readOnlySearchParams]);

  const setSearchPrams = useCallback(
    (
      searchParams:
        | Record<string, string>
        | ((prev: Record<string, string>) => Record<string, string>)
    ) => {
      const params =
        typeof searchParams === "function"
          ? searchParams(searchParamsMap)
          : searchParams;
      const parsedSearchParam = new URLSearchParams();
      for (const key in params) parsedSearchParam.set(key, params[key]);
      router.replace(`${pathName}?${parsedSearchParam.toString()}`, {
        scroll: false,
      });
    },

    [pathName, router, searchParamsMap]
  );

  return useMemo(
    () => ({ searchParams: searchParamsMap, setSearchPrams }),
    [searchParamsMap, setSearchPrams]
  );
};

export default useSearchParams;
