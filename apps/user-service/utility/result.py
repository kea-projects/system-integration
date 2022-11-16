from typing import Any
from typing import TypeVar, Generic

T = TypeVar("T")


class Result(Generic[T]):
    def is_err(self) -> bool:
        return True if type(self) == Err else False

    def is_ok(self) -> bool:
        return True if type(self) == Ok else False

    def data(self) -> T:
        if self.is_ok():
            return self.ok  # type: ignore
        else:
            raise Exception("Can not extract contents of non-ok object")

    def err(self) -> T:
        if self.is_err():
            return self.detail  # type: ignore
        else:
            raise Exception("Can not extract contents of non-error object")

    def __str__(self) -> str:
        return str(self.__dict__)


class Err(Result, Generic[T]):
    error: str
    detail: T

    def __init__(self, kind: str, detail: T) -> None:
        self.error = kind
        self.detail: T = detail


class Ok(Result, Generic[T]):
    ok: T

    def __init__(self, data: T) -> None:
        self.ok: T = data
