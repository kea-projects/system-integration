from typing import Any
from typing import TypeVar, Generic

T = TypeVar("T")


class Result():
    def is_err(self) -> bool:
        return True if type(self) == Err else False

    def is_ok(self) -> bool:
        return True if type(self) == Ok else False

    def ok(self) -> Any:
        if self.is_ok():
            return self.data  # type: ignore
        else:
            raise Exception("Can not extract contents of non-ok object")

    def err(self) -> Any:
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
    data: T

    def __init__(self, data: T) -> None:
        self.data: T = data
