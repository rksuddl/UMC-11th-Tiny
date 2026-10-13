import { useState, type SubmitEvent } from "react";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import { getApiErrorStatus } from "../../api/members/get-api-error-status";
import { cn } from "../../utils/cn";

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

type CheckResult = { ok: boolean; message: string } | null;

interface CheckMessages {
  available: string;
  taken: string;
  invalid: string;
}

/* 입력값 + 중복 확인 결과를 함께 관리하는 훅 */
function useDuplicateCheck(
  request: (value: string) => Promise<{ available: boolean }>,
  messages: CheckMessages,
) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<CheckResult>(null);
  const [isChecking, setIsChecking] = useState(false);

  function change(nextValue: string) {
    setValue(nextValue);
    setResult(null); // 값이 바뀌면 다시 확인해야 해요
  }

  async function check() {
    const trimmed = value.trim();
    if (!trimmed) return;

    setIsChecking(true);
    try {
      const response = await request(trimmed);
      setResult(
        response.available
          ? { ok: true, message: messages.available }
          : { ok: false, message: messages.taken },
      );
    } catch (error) {
      const status = getApiErrorStatus(error);
      setResult({
        ok: false,
        message:
          status === 400
            ? messages.invalid
            : status
              ? `확인에 실패했어요. (${status})`
              : "서버에 연결하지 못했어요.",
      });
    } finally {
      setIsChecking(false);
    }
  }

  return { value, change, result, isChecking, check };
}

/* 입력칸 오른쪽에 '중복 확인' 버튼이 붙은 필드 */
interface DuplicateCheckFieldProps {
  label: string;
  type?: string;
  placeholder: string;
  field: ReturnType<typeof useDuplicateCheck>;
}

function DuplicateCheckField({
  label,
  type = "text",
  placeholder,
  field,
}: DuplicateCheckFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold">{label}</label>
      <div className="flex items-center rounded-lg border border-gray-200 bg-white px-3 focus-within:border-black">
        <input
          type={type}
          value={field.value}
          placeholder={placeholder}
          onChange={(event) => field.change(event.target.value)}
          className="h-11 flex-1 bg-transparent text-sm outline-none"
        />
        <button
          type="button"
          onClick={field.check}
          disabled={field.isChecking || !field.value.trim()}
          className="cursor-pointer text-xs font-semibold text-blue-600 disabled:cursor-default disabled:text-gray-300"
        >
          {field.isChecking ? "확인 중" : "중복 확인"}
        </button>
      </div>
      {field.result && (
        <p
          className={cn(
            "mt-1.5 text-xs",
            field.result.ok ? "text-blue-600" : "text-red-500",
          )}
        >
          {field.result.message}
        </p>
      )}
    </div>
  );
}

export function SignupPage() {
  const email = useDuplicateCheck(checkEmail, {
    available: "사용 가능한 이메일이에요.",
    taken: "이미 사용 중인 이메일이에요.",
    invalid: "이메일 형식이 올바르지 않아요.",
  });
  const nickname = useDuplicateCheck(checkNickname, {
    available: "사용 가능한 닉네임이에요.",
    taken: "이미 사용 중인 닉네임이에요.",
    invalid: "닉네임은 2~12자로 입력해 주세요.",
  });
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [notice, setNotice] = useState("");

  const isPasswordValid = PASSWORD_RULE.test(password);
  const isPasswordMatched = password === passwordConfirm;
  const canSubmit =
    email.result?.ok === true &&
    nickname.result?.ok === true &&
    isPasswordValid &&
    isPasswordMatched;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    // 회원가입(POST) API는 아직 없어서, 지금은 검증 통과까지만 확인해요.
    setNotice(
      "모든 항목을 확인했어요. 회원가입 API는 이후 주차에 연결할 예정이에요.",
    );
  }

  return (
    <main className="flex justify-center px-4 py-24">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-5"
      >
        <h1 className="text-3xl font-bold">회원가입</h1>

        <DuplicateCheckField
          label="이메일"
          type="email"
          placeholder="name@example.com"
          field={email}
        />
        <DuplicateCheckField
          label="닉네임"
          placeholder="2~12자"
          field={nickname}
        />

        <div>
          <label className="mb-2 block text-xs font-semibold">비밀번호</label>
          <input
            type="password"
            value={password}
            placeholder="8자 이상"
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-black"
          />
          <p
            className={cn(
              "mt-1.5 text-xs",
              password && !isPasswordValid ? "text-red-500" : "text-gray-400",
            )}
          >
            영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요
          </p>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold">
            비밀번호 확인
          </label>
          <input
            type="password"
            value={passwordConfirm}
            placeholder="다시 입력"
            onChange={(event) => setPasswordConfirm(event.target.value)}
            className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-black"
          />
          {passwordConfirm && !isPasswordMatched && (
            <p className="mt-1.5 text-xs text-red-500">
              비밀번호가 일치하지 않아요.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="h-11 cursor-pointer rounded-lg bg-blue-600 text-sm font-semibold text-white disabled:cursor-default disabled:opacity-40"
        >
          가입하기
        </button>
        {notice && (
          <p className="text-center text-xs text-blue-600">{notice}</p>
        )}

        <p className="text-center text-xs text-gray-500">
          이미 계정이 있나요?{" "}
          <span className="font-semibold text-blue-600">로그인</span>
        </p>
      </form>
    </main>
  );
}
